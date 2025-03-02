import React, { useState } from 'react';

interface ReplyFormProps {
  onSubmit: (text: string) => Promise<void>;
  onCancel: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ onSubmit, onCancel }) => {
  const [replyText, setReplyText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (replyText.trim() === '') {
      setError('Please enter a reply');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(replyText);
      setReplyText('');
    } catch (err) {
      setError('Failed to submit reply');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reply-form">
      {error && <div className="error-message">{error}</div>}
      
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write your reply..."
        rows={3}
        disabled={isSubmitting}
      />
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Reply'}
        </button>
        <button 
          type="button"
          className="cancel-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;