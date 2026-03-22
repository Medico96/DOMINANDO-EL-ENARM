import axios from 'axios';

interface Question {
  id: number;
  pregunta: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  opcionD: string;
  respuesta_correcta: string;
  especialidad: string;
  materia: string;
  explicacion?: string;
}

interface FetchOptions {
  especialidad?: string;
  materia?: string;
  limit?: number;
  offset?: number;
}

/**
 * Servicio para obtener preguntas de la base de datos
 * Soporta múltiples backends: Supabase, API REST, Firebase
 */

// Opción 1: Supabase
export const fetchQuestionsFromSupabase = async (options: FetchOptions): Promise<Question[]> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  try {
    const params = new URLSearchParams();
    params.append('select', '*');

    if (options.especialidad && options.especialidad !== 'all') {
      params.append('especialidad', `eq.${options.especialidad}`);
    }

    if (options.limit) {
      params.append('limit', options.limit.toString());
    }

    if (options.offset) {
      params.append('offset', options.offset.toString());
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/preguntas?${params}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    throw error;
  }
};

// Opción 2: API REST personalizada
export const fetchQuestionsFromAPI = async (options: FetchOptions): Promise<Question[]> => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  try {
    const response = await axios.get(`${apiUrl}/preguntas`, {
      params: {
        especialidad: options.especialidad !== 'all' ? options.especialidad : undefined,
        materia: options.materia,
        limit: options.limit || 10,
        offset: options.offset || 0,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching from API:', error);
    throw error;
  }
};

// Función genérica que intenta usar Supabase, fallback a API
export const fetchQuestions = async (options: FetchOptions): Promise<Question[]> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    return fetchQuestionsFromSupabase(options);
  }

  return fetchQuestionsFromAPI(options);
};

// Obtener una pregunta por ID
export const getQuestionById = async (id: number): Promise<Question> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/preguntas?id=eq.${id}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    const data = await response.json();
    return data[0];
  }

  // Fallback a API
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/preguntas/${id}`
  );
  return response.data;
};

// Guardar respuesta del usuario (opcional)
export const saveUserAnswer = async (
  userId: string,
  questionId: number,
  answer: string,
  isCorrect: boolean
): Promise<void> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    await fetch(`${supabaseUrl}/rest/v1/respuestas_usuario`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario_id: userId,
        pregunta_id: questionId,
        respuesta: answer,
        es_correcta: isCorrect,
      }),
    });
  }
};

// Obtener estadísticas del usuario (opcional)
export const getUserStatistics = async (userId: string) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/respuestas_usuario?usuario_id=eq.${userId}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    const data = await response.json();
    
    const correct = data.filter((r: any) => r.es_correcta).length;
    const incorrect = data.filter((r: any) => !r.es_correcta).length;

    return {
      total: data.length,
      correct,
      incorrect,
      percentage: data.length > 0 ? Math.round((correct / data.length) * 100) : 0,
    };
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    return null;
  }
};
