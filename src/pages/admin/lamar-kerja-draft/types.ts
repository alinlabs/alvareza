import { JobApplicationDraftItem } from '../../../types/jobDraft';

export interface JobDraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForEdit?: (draft: JobApplicationDraftItem) => void;
  highlightDraftId?: string | null;
}
