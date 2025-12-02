/**
 * Helper para extraer datos de respuestas de API
 * Maneja diferentes estructuras de respuesta (paginada, directa, envuelta en data)
 */
export const extractData = <T>(response: any): T[] => {
    console.log('🔍 extractData input:', response);
    if (!response) return [];

    // Caso 1: Respuesta paginada estándar { data: { items: [...] } }
    if (Array.isArray(response.data?.items)) {
        console.log('✅ Case 1 matched');
        return response.data.items;
    }

    // Caso 2: Respuesta paginada anidada { data: { data: { items: [...] } } }
    if (Array.isArray(response.data?.data?.items)) {
        console.log('✅ Case 2 matched');
        return response.data.data.items;
    }

    // Caso 3: Respuesta envuelta en data { data: { data: [...] } }
    if (Array.isArray(response.data?.data)) {
        console.log('✅ Case 3 matched');
        return response.data.data;
    }

    // Caso 4: Respuesta directa en data { data: [...] }
    if (Array.isArray(response.data)) {
        console.log('✅ Case 4 matched');
        return response.data;
    }

    // Caso 5: Respuesta directa es un array [...]
    if (Array.isArray(response)) {
        console.log('✅ Case 5 matched');
        return response;
    }

    console.warn('⚠️ No matching case for extractData');
    return [];
};
