import { DocumentType, EmployeeDocument } from '../interfaces/documents';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const documentService = {
    async getDocumentTypes(token: string): Promise<DocumentType[]> {
        const response = await fetch(`${API_URL}/document-types`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Error al obtener tipos de documentos');
        return response.json();
    },

    async getEmployeeDocuments(employeeId: number, token: string): Promise<EmployeeDocument[]> {
        const response = await fetch(`${API_URL}/employees/${employeeId}/documents`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Error al obtener documentos del empleado');
        return response.json();
    },

    async uploadDocument(file: File, employeeId: number, documentTypeId: number, token: string): Promise<EmployeeDocument> {
        if (isNaN(documentTypeId)) {
            throw new Error("documentTypeId debe ser un número válido.");
        }
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type_id', documentTypeId.toString());
        formData.append('employee_id', employeeId.toString());
    
        const response = await fetch(`${API_URL}/documents/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message?.[0] || 'Error al subir el documento');
        }
    
        return response.json();
    },

    async deleteDocument(documentId: number, token: string): Promise<void> {
        console.log(documentId, token);
        const response = await fetch(`${API_URL}/documents/${documentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Error al eliminar el documento');
    }
}; 