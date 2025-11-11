# 🔐 IDENTIFIANTS DE TEST - ENA PORTAIL RH

## ⚠️ IMPORTANT
Ces identifiants sont pour **DÉVELOPPEMENT UNIQUEMENT**.  
À remplacer par une vraie authentification API en production.

---

## 👤 COMPTES DE TEST DISPONIBLES

### 1️⃣ SUPER ADMIN (Accès Total)

```
Email    : superadmin@ena.cd
Password : SuperAdmin2024!
```

**Utilisateur :**
- Nom : Victor Bafuafua
- Poste : Directeur Général
- Département : Direction Générale

**Permissions :**
- ✅ TOUTES les permissions (100%)
- ✅ Gestion des permissions
- ✅ Gestion des utilisateurs admin
- ✅ Paramètres système
- ✅ Tous les modules

**Accès aux pages :**
- ✅ Dashboard
- ✅ Employés (CRUD complet)
- ✅ Absences (Approbation)
- ✅ Formations
- ✅ Évaluations
- ✅ Paie (Lecture/Écriture)
- ✅ Recrutement
- ✅ Documents
- ✅ Pointage
- ✅ Rapports
- ✅ Paramètres

---

### 2️⃣ ADMIN (Gestion Complète)

```
Email    : admin@ena.cd
Password : Admin2024!
```

**Utilisateur :**
- Nom : Marie Kabongo
- Poste : Administrateur Système
- Département : Administration

**Permissions :**
- ✅ Tous les modules (sauf gestion super-admin)
- ✅ CRUD Employés
- ✅ Approbation absences
- ✅ Gestion formations
- ✅ Évaluations
- ✅ Paie
- ✅ Recrutement
- ❌ Gestion des permissions système

**Accès aux pages :**
- ✅ Dashboard
- ✅ Employés (CRUD)
- ✅ Absences (Approbation)
- ✅ Formations
- ✅ Évaluations
- ✅ Paie
- ✅ Recrutement
- ✅ Documents
- ✅ Pointage
- ✅ Rapports
- ⚠️ Paramètres (limité)

---

### 3️⃣ RH (Ressources Humaines)

```
Email    : rh@ena.cd
Password : RH2024!
```

**Utilisateur :**
- Nom : Jean Mukendi
- Poste : Responsable RH
- Département : Ressources Humaines

**Permissions :**
- ✅ Gestion employés
- ✅ Gestion absences
- ✅ Gestion formations
- ✅ Évaluations
- ✅ Recrutement
- ❌ Paie (consultation uniquement)
- ❌ Paramètres système

**Accès aux pages :**
- ✅ Dashboard
- ✅ Employés (CRUD)
- ✅ Absences (Approbation)
- ✅ Formations (Gestion complète)
- ✅ Évaluations
- ✅ Recrutement
- ✅ Documents (RH)
- ⚠️ Pointage (consultation)
- ⚠️ Paie (consultation uniquement)
- ❌ Paramètres

---

### 4️⃣ EMPLOYÉ (Accès Limité)

```
Email    : employe@ena.cd
Password : Employe2024!
```

**Utilisateur :**
- Nom : Grace Tshimanga
- Poste : Assistant Administratif
- Département : Administration

**Permissions :**
- ✅ Voir le dashboard
- ✅ Voir son profil
- ✅ Demander des absences (ses propres absences)
- ✅ Voir ses formations
- ✅ Pointage personnel
- ❌ Voir les autres employés
- ❌ Approuver des absences
- ❌ Gérer des formations
- ❌ Paie
- ❌ Paramètres

**Accès aux pages :**
- ✅ Dashboard (vue limitée)
- ⚠️ Mon Profil uniquement
- ⚠️ Mes Absences (création/consultation)
- ⚠️ Mes Formations
- ⚠️ Mes Évaluations
- ⚠️ Mon Pointage
- ⚠️ Mes Documents
- ❌ Gestion Employés
- ❌ Approbations
- ❌ Paie
- ❌ Rapports
- ❌ Paramètres

---

## 🎯 TEST DES RÔLES

### Comment tester chaque rôle :

1. **Déconnectez-vous** (si connecté)
2. Allez sur la page de login
3. Entrez l'email et le mot de passe du rôle à tester
4. Observez les différences :
   - Menu de navigation
   - Pages accessibles
   - Boutons d'action disponibles
   - Formulaires visibles

### Exemple de scénario de test :

**Test Super Admin :**
```bash
1. Login avec superadmin@ena.cd
2. Aller dans Employés → Voir le bouton "Supprimer" ✅
3. Aller dans Paramètres → Accès complet ✅
4. Aller dans Paie → Peut modifier les salaires ✅
```

**Test Employé :**
```bash
1. Login avec employe@ena.cd
2. Aller dans Employés → Page inaccessible ❌
3. Dashboard → Vue limitée aux infos personnelles ✅
4. Mes Absences → Peut créer une demande ✅
5. Paie → Voir uniquement ses propres bulletins ✅
```

---

## 📊 MATRICE DES PERMISSIONS

| Fonctionnalité | Super Admin | Admin | RH | Employé |
|----------------|-------------|-------|-----|---------|
| **Dashboard** | ✅ Complet | ✅ Complet | ✅ Complet | ⚠️ Limité |
| **Employés - Voir** | ✅ | ✅ | ✅ | ❌ |
| **Employés - Créer** | ✅ | ✅ | ✅ | ❌ |
| **Employés - Modifier** | ✅ | ✅ | ✅ | ❌ |
| **Employés - Supprimer** | ✅ | ✅ | ⚠️ | ❌ |
| **Absences - Voir toutes** | ✅ | ✅ | ✅ | ❌ |
| **Absences - Approuver** | ✅ | ✅ | ✅ | ❌ |
| **Absences - Créer (soi)** | ✅ | ✅ | ✅ | ✅ |
| **Formations - Gérer** | ✅ | ✅ | ✅ | ❌ |
| **Formations - S'inscrire** | ✅ | ✅ | ✅ | ✅ |
| **Évaluations - Créer** | ✅ | ✅ | ✅ | ❌ |
| **Évaluations - Voir** | ✅ | ✅ | ✅ | ⚠️ Sienne |
| **Paie - Gérer** | ✅ | ✅ | ❌ | ❌ |
| **Paie - Consulter** | ✅ | ✅ | ⚠️ Toutes | ⚠️ Sienne |
| **Recrutement** | ✅ | ✅ | ✅ | ❌ |
| **Rapports** | ✅ | ✅ | ⚠️ | ❌ |
| **Paramètres** | ✅ | ⚠️ | ❌ | ❌ |
| **Permissions** | ✅ | ❌ | ❌ | ❌ |

**Légende :**
- ✅ = Accès complet
- ⚠️ = Accès limité
- ❌ = Pas d'accès

---

## 🔄 CHANGER DE RÔLE

Pour tester différents rôles :

1. Cliquez sur votre profil (en haut à droite)
2. Cliquez sur "Déconnexion"
3. Reconnectez-vous avec un autre compte

---

## 🛡️ SÉCURITÉ

### En développement :
- ✅ Mots de passe en clair dans le code
- ✅ Pas de hashage
- ✅ Validation basique

### En production (À IMPLÉMENTER) :
- ❌ Mots de passe hashés (bcrypt)
- ❌ JWT tokens
- ❌ Refresh tokens
- ❌ Rate limiting
- ❌ 2FA (Two-Factor Authentication)
- ❌ Logs d'audit
- ❌ Session timeout

---

## 📝 FICHIERS CONCERNÉS

```
src/
├── data/
│   └── mockUsers.ts          # Définition des utilisateurs de test
├── pages/
│   └── auth/
│       └── Login.tsx          # Page de connexion (utilise mockUsers)
├── contexts/
│   └── AuthContext.tsx        # Context d'authentification
└── utils/
    └── permissions.ts         # Logique des permissions par rôle
```

---

## 🚀 DÉPLOIEMENT

**⚠️ AVANT DE DÉPLOYER EN PRODUCTION :**

1. Supprimer `src/data/mockUsers.ts`
2. Remplacer par des appels API réels
3. Implémenter JWT tokens
4. Hasher les mots de passe
5. Ajouter HTTPS obligatoire
6. Configurer CORS correctement
7. Ajouter rate limiting

---

## 📞 AIDE

**Mot de passe oublié ?**
→ Utilisez les identifiants ci-dessus

**Compte bloqué ?**
→ Pas de blocage en mode développement

**Erreur de connexion ?**
→ Vérifiez que vous utilisez les emails exacts (sensibles à la casse pour le domaine)

**Changer de rôle ?**
→ Déconnectez-vous et reconnectez-vous avec un autre compte

---

**Date de création :** 2025-01-15  
**Environnement :** Développement uniquement  
**Status :** ⚠️ NE PAS UTILISER EN PRODUCTION

