import crypto from 'crypto';
import express from 'express';
import { requireAuth, requireRole } from './auth.js';
import { readEmployees, writeEmployees } from './store.js';

const MANAGERS = ['super_admin', 'admin', 'hr'];

function canManage(user) {
  return MANAGERS.includes(user.role);
}

function normalizeEmployee(input, current = {}) {
  const emergency = input.emergencyContact && typeof input.emergencyContact === 'object'
    ? input.emergencyContact
    : {
      name: input.emergencyContactName || current.emergencyContact?.name || '',
      phone: input.emergencyPhone || input.emergencyContactPhone || current.emergencyContact?.phone || '',
      relationship: input.emergencyContactRelationship || current.emergencyContact?.relationship || '',
    };

  const hireDate = input.hireDate
    ? new Date(input.hireDate).toISOString()
    : current.hireDate || new Date().toISOString();
  const dateOfBirth = input.dateOfBirth
    ? new Date(input.dateOfBirth).toISOString()
    : current.dateOfBirth || null;

  return {
    id: current.id || crypto.randomUUID(),
    firstName: String(input.firstName ?? current.firstName ?? '').trim(),
    lastName: String(input.lastName ?? current.lastName ?? '').trim(),
    email: String(input.email ?? current.email ?? '').trim().toLowerCase(),
    phone: String(input.phone ?? current.phone ?? '').trim(),
    position: String(input.position ?? current.position ?? '').trim(),
    department: String(input.department ?? current.department ?? '').trim(),
    salary: Number(input.salary ?? current.salary ?? 0),
    hireDate,
    dateOfBirth,
    status: input.status || current.status || 'active',
    address: String(input.address ?? current.address ?? '').trim(),
    emergencyContact: {
      name: String(emergency.name || ''),
      phone: String(emergency.phone || ''),
      relationship: String(emergency.relationship || ''),
    },
  };
}

export function createEmployeesRouter() {
  const router = express.Router();
  router.use(requireAuth);

  router.get('/', (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 100);
    const search = String(req.query.search || req.query.q || '').toLowerCase();
    const department = String(req.query.department || '');
    const status = String(req.query.status || '');

    let items = readEmployees();
    if (search) {
      items = items.filter((employee) =>
        [employee.firstName, employee.lastName, employee.email, employee.position, employee.department]
          .join(' ')
          .toLowerCase()
          .includes(search)
      );
    }
    if (department) {
      items = items.filter((employee) => employee.department === department);
    }
    if (status) {
      items = items.filter((employee) => employee.status === status);
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = items.slice(start, start + limit);

    return res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  });

  router.get('/search', (req, res) => {
    const q = String(req.query.q || '').toLowerCase();
    const data = readEmployees().filter((employee) =>
      [employee.firstName, employee.lastName, employee.email, employee.position]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
    return res.json({ success: true, data });
  });

  router.get('/statistics', (_req, res) => {
    const items = readEmployees();
    const byDepartment = {};
    const byPosition = {};
    let salarySum = 0;
    for (const employee of items) {
      byDepartment[employee.department] = (byDepartment[employee.department] || 0) + 1;
      byPosition[employee.position] = (byPosition[employee.position] || 0) + 1;
      salarySum += Number(employee.salary) || 0;
    }
    return res.json({
      success: true,
      data: {
        total: items.length,
        active: items.filter((item) => item.status === 'active').length,
        inactive: items.filter((item) => item.status === 'inactive').length,
        onLeave: items.filter((item) => item.status === 'on_leave').length,
        byDepartment,
        byPosition,
        averageSalary: items.length ? Math.round(salarySum / items.length) : 0,
        averageTenure: 0,
      },
    });
  });

  router.get('/department/:department', (req, res) => {
    const data = readEmployees().filter((employee) => employee.department === req.params.department);
    return res.json({ success: true, data });
  });

  router.get('/:id', (req, res) => {
    const employee = readEmployees().find((item) => item.id === req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employé introuvable' });
    }
    return res.json({ success: true, data: employee });
  });

  router.post('/', requireRole(...MANAGERS), (req, res) => {
    const employees = readEmployees();
    const created = normalizeEmployee(req.body);
    if (!created.firstName || !created.email) {
      return res.status(400).json({ success: false, message: 'Prénom et email requis' });
    }
    if (employees.some((item) => item.email === created.email)) {
      return res.status(409).json({ success: false, message: 'Un employé avec cet email existe déjà' });
    }
    employees.push(created);
    writeEmployees(employees);
    return res.status(201).json({ success: true, data: created });
  });

  router.put('/:id', (req, res) => {
    const employees = readEmployees();
    const index = employees.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Employé introuvable' });
    }

    const isSelf = req.user.id === req.params.id;
    if (!isSelf && !canManage(req.user)) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const updated = normalizeEmployee(req.body, employees[index]);
    if (employees.some((item, i) => i !== index && item.email === updated.email)) {
      return res.status(409).json({ success: false, message: 'Un employé avec cet email existe déjà' });
    }
    employees[index] = updated;
    writeEmployees(employees);
    return res.json({ success: true, data: updated });
  });

  router.delete('/:id', requireRole(...MANAGERS), (req, res) => {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ success: false, message: 'Vous ne pouvez pas supprimer votre propre fiche' });
    }
    const employees = readEmployees();
    const next = employees.filter((item) => item.id !== req.params.id);
    if (next.length === employees.length) {
      return res.status(404).json({ success: false, message: 'Employé introuvable' });
    }
    writeEmployees(next);
    return res.json({ success: true, message: 'Employé supprimé' });
  });

  router.post('/:id/toggle-status', requireRole(...MANAGERS), (req, res) => {
    const employees = readEmployees();
    const employee = employees.find((item) => item.id === req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employé introuvable' });
    }
    employee.status = employee.status === 'active' ? 'inactive' : 'active';
    writeEmployees(employees);
    return res.json({ success: true, data: employee });
  });

  router.get('/:id/history', (_req, res) => {
    return res.json({ success: true, data: [] });
  });

  return router;
}
