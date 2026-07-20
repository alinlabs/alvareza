import { useFormState } from './useFormState';
import { useEmailActions } from './useEmailActions';

export function useEmailSender() {
  const form = useFormState();
  const actions = useEmailActions(form);

  return {
    ...form,
    ...actions
  };
}
