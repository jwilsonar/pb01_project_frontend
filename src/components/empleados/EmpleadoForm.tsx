'use client';

import { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    TextField,
    Box,
    Alert,
    Button,
    Typography,
    Divider
} from '@mui/material';
import { documentService } from '../../services/documentService';
import VisualizadorDocs from '../../components/VisualizadorDocs';
import { DocumentType } from '../../interfaces/documents';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
interface FormErrors {
    // Campos de usuario
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    // Campos de empleado
    job_title?: string;
    salary?: string;
}

export interface EmpleadoFormData {
    job_title: string;
    salary: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

interface EmpleadoFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: EmpleadoFormData) => Promise<void>;
    empleado?: Employee | null;
}

interface Employee {
    id: number;
    job_title: string;
    salary: number;
    first_name: string;
    last_name: string;
    email: string;
    documents: any[];
    documents_count: number;
    created_by: {
        id: number;
        email: string;
    };
}

export default function EmpleadoForm({ open, onClose, onSubmit, empleado }: EmpleadoFormProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [formData, setFormData] = useState<EmpleadoFormData>({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        job_title: '',
        salary: 0,
    });

    useEffect(() => {
        const fetchDocumentTypes = async () => {
            try {
                const types = await documentService.getDocumentTypes(localStorage.getItem('token') || '');
                setDocumentTypes(types);
            } catch (error) {
                console.error('Error al cargar tipos de documentos:', error);
            }
        };

        fetchDocumentTypes();
    }, []);

    useEffect(() => {
        if (empleado) {
            setFormData({
                email: empleado.email,
                password: '', // La contraseña no se muestra por seguridad
                first_name: empleado.first_name,
                last_name: empleado.last_name,
                job_title: empleado.job_title,
                salary: empleado.salary,
            });
        } else {
            setFormData({
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                job_title: '',
                salary: 0,
            });
        }
    }, [empleado]);

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        let isValid = true;

        // Validación de nombre
        if (!formData.first_name.trim()) {
            errors.first_name = 'El nombre es requerido';
            isValid = false;
        } else if (formData.first_name.length < 2) {
            errors.first_name = 'El nombre debe tener al menos 2 caracteres';
            isValid = false;
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.first_name)) {
            errors.first_name = 'El nombre solo debe contener letras';
            isValid = false;
        }

        // Validación de apellidos
        if (!formData.last_name.trim()) {
            errors.last_name = 'Los apellidos son requeridos';
            isValid = false;
        } else if (formData.last_name.length < 2) {
            errors.last_name = 'Los apellidos deben tener al menos 2 caracteres';
            isValid = false;
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.last_name)) {
            errors.last_name = 'Los apellidos solo deben contener letras';
            isValid = false;
        }

        // Validación de email
        if (!formData.email) {
            errors.email = 'El correo electrónico es requerido';
            isValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            errors.email = 'Correo electrónico inválido';
            isValid = false;
        }

        // Validación de contraseña
        if (!empleado && !formData.password) {
            errors.password = 'La contraseña es requerida';
            isValid = false;
        } else if (formData.password && formData.password.length > 0) {
            if (formData.password.length < 6) {
                errors.password = 'La contraseña debe tener al menos 6 caracteres';
                isValid = false;
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                errors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
                isValid = false;
            }
        }

        // Validación de puesto
        if (!formData.job_title.trim()) {
            errors.job_title = 'El puesto es requerido';
            isValid = false;
        } else if (formData.job_title.length < 2) {
            errors.job_title = 'El puesto debe tener al menos 2 caracteres';
            isValid = false;
        }

        // Validación de salario
        if (formData.salary <= 0) {
            errors.salary = 'El salario debe ser un número positivo';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Manejo especial para el campo salary
        if (name === 'salary') {
            const numericValue = value === '' ? 0 : parseFloat(value);
            setFormData(prev => ({
                ...prev,
                salary: numericValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Limpiar el error del campo cuando el usuario empiece a escribir
        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                salary: Number(formData.salary)
            };
            
            await onSubmit(dataToSubmit);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleDeleteDocument = async (documentId: number) => {
        try {
            await documentService.deleteDocument(
                documentId, 
                session?.accessToken || ''
            );
            
            // Actualizar la lista de documentos localmente
            if (empleado) {
                const updatedDocuments = empleado.documents.filter(doc => doc.id !== documentId);
                empleado.documents = updatedDocuments;
                // Forzar actualización del componente
                setFormData(prev => ({ ...prev }));
            }
        } catch (error) {
            console.error('Error al eliminar documento:', error);
        }
    };

    const handleUploadDocument = async (file: File, documentTypeId: number) => {
        if (!empleado?.id) return;
        
        try {
            const newDocument = await documentService.uploadDocument(
                file,
                empleado.id,
                documentTypeId,
                session?.accessToken || ''
            );
            
            // Actualizar la lista de documentos localmente
            if (empleado) {
                empleado.documents = [...empleado.documents, newDocument];
                // Forzar actualización del componente
                setFormData(prev => ({ ...prev }));
            }
        } catch (error) {
            console.error('Error al subir documento:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {empleado ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <Typography variant="h6" color="primary">
                            Información de Usuario
                        </Typography>
                        <TextField
                            required
                            label="Nombre"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            error={!!formErrors.first_name}
                            helperText={formErrors.first_name}
                            fullWidth
                        />
                        <TextField
                            required
                            label="Apellidos"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            error={!!formErrors.last_name}
                            helperText={formErrors.last_name}
                            fullWidth
                        />
                        <TextField
                            required
                            type="email"
                            label="Correo Electrónico"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            fullWidth
                        />
                        <TextField
                            required={!empleado}
                            type="password"
                            label={empleado ? 'Contraseña (dejar en blanco para mantener)' : 'Contraseña'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                            fullWidth
                        />

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" color="primary">
                            Información Laboral
                        </Typography>
                        <TextField
                            required
                            label="Puesto"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleInputChange}
                            error={!!formErrors.job_title}
                            helperText={formErrors.job_title}
                            fullWidth
                        />
                        <TextField
                            required
                            type="number"
                            label="Salario"
                            name="salary"
                            value={formData.salary}
                            onChange={handleInputChange}
                            error={!!formErrors.salary}
                            helperText={formErrors.salary}
                            inputProps={{ min: "0", step: "0.01" }}
                            fullWidth
                        />

                        {empleado && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <VisualizadorDocs
                                    employeeId={empleado.id}
                                    documentTypes={documentTypes}
                                    documents={empleado.documents || []}
                                    onDeleteDocument={handleDeleteDocument}
                                    onUploadDocument={handleUploadDocument}
                                />
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained">
                        {empleado ? 'Actualizar' : 'Guardar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
} 