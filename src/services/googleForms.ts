import { Question } from '../types/exam';
import { getAccessToken } from './googleAuth';

export interface FormCreationResult {
  formId: string;
  responderUri: string;
  editUri: string;
  title: string;
}

export const createGoogleFormFromExam = async (
  title: string,
  questions: Question[]
): Promise<FormCreationResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google authentication required. Please sign in with Google first.');
  }

  // 1. Create the Form
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: title || 'JFT-Basic A2 Mock Exam',
        documentTitle: title || 'JFT-Basic A2 Mock Exam',
      },
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create Google Form (${createRes.status})`);
  }

  const formData = await createRes.json();
  const formId = formData.formId;
  const responderUri = formData.responderUri || `https://docs.google.com/forms/d/e/${formId}/viewform`;
  const editUri = `https://docs.google.com/forms/d/${formId}/edit`;

  // 2. Add questions via batchUpdate
  if (questions.length > 0) {
    const requests = questions.map((q, index) => {
      const cleanPassage = q.passage ? `【本文】\n${q.passage}\n\n` : '';
      const promptTitle = `[Q${index + 1}] ${q.title}\n${cleanPassage}${q.question}`;
      const description = `【বাংলা অর্থ ও ব্যাখ্যা】\n${q.explanationBn.meaningBn}\n\nসঠিক উত্তরের কারণ: ${q.explanationBn.correctReasonBn}`;

      return {
        createItem: {
          item: {
            title: promptTitle,
            description: description,
            questionItem: {
              question: {
                required: false,
                choiceQuestion: {
                  type: 'RADIO',
                  options: q.options.map((opt) => ({
                    value: opt,
                  })),
                  shuffle: false,
                },
              },
            },
          },
          location: {
            index: index,
          },
        },
      };
    });

    const updateRes = await fetch(`https://forms.googleapis.com/v1/forms/${encodeURIComponent(formId)}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests,
      }),
    });

    if (!updateRes.ok) {
      console.warn('Batch update warned:', await updateRes.text().catch(() => ''));
    }
  }

  return {
    formId,
    responderUri,
    editUri,
    title,
  };
};
