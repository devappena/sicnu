import { useForm, UseFormProps, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

/**
 * Hook personnalisé qui combine react-hook-form avec Zod
 * 
 * @example
 * ```tsx
 * const { register, handleSubmit, formState: { errors } } = useZodForm({
 *   schema: employeeSchema,
 *   defaultValues: {
 *     firstName: '',
 *     lastName: '',
 *   }
 * });
 * ```
 */
export function useZodForm<TFormValues extends FieldValues = FieldValues>(
  props: UseFormProps<TFormValues> & {
    schema: ZodSchema;
  }
) {
  const { schema, ...formProps } = props;
  
  return useForm<TFormValues>({
    ...formProps,
    resolver: zodResolver(schema),
  });
}
