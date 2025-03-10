'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Avatar, 
    Divider,
    Box,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { 
    Email as EmailIcon, 
    Work as WorkIcon,
    AttachMoney as MoneyIcon,
    Badge as BadgeIcon
} from '@mui/icons-material';
import { documentService } from '../../services/documentService';
import VisualizadorDocs from '../../components/VisualizadorDocs';
import { DocumentType } from '../../interfaces/documents';

interface Employee {
    id: number;
    job_title: string;
    salary: number;
    documents: any[];
}

interface UserProfile {
    id: number;
    email: string;
    is_hr: boolean;
    employee: Employee;
    first_name: string;
    last_name: string;  
}

export default function MiPerfil() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

    useEffect(() => {
        const fetchDocumentTypes = async () => {
            try {
                // @ts-ignore
                const token = session?.accessToken;
                if (!token) return;
                
                const types = await documentService.getDocumentTypes(token);
                setDocumentTypes(types);
            } catch (error) {
                console.error('Error al cargar tipos de documentos:', error);
            }
        };

        if (session) {
            fetchDocumentTypes();
        }
    }, [session]);

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            router.replace('/');
            return;
        }

        const fetchUser = async () => {
            try {
                // @ts-ignore
                const token = session?.accessToken;
                
                if (!token) {
                    router.replace('/');
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        router.replace('/');
                        return;
                    }
                    throw new Error('Error al cargar los datos del perfil');
                }
                
                const data = await response.json();
                console.log(data);
                setUser(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [session, status, router]);

    const handleDeleteDocument = async (documentId: number) => {
        try {
            // @ts-ignore
            const token = session?.accessToken;
            if (!token) return;

            await documentService.deleteDocument(documentId, token);
            
            if (user && user.employee) {
                const updatedDocuments = user.employee.documents.filter(
                    doc => doc.id !== documentId
                );
                setUser({
                    ...user,
                    employee: {
                        ...user.employee,
                        documents: updatedDocuments
                    }
                });
            }
        } catch (error) {
            console.error('Error al eliminar documento:', error);
        }
    };

    const handleUploadDocument = async (file: File, documentTypeId: number) => {
        if (!user?.employee?.id) return;
        
        try {
            // @ts-ignore
            const token = session?.accessToken;
            if (!token) return;

            const newDocument = await documentService.uploadDocument(
                file,
                user.employee.id,
                documentTypeId,
                token
            );
            
            if (user && user.employee) {
                setUser({
                    ...user,
                    employee: {
                        ...user.employee,
                        documents: [...user.employee.documents, newDocument]
                    }
                });
            }
        } catch (error) {
            console.error('Error al subir documento:', error);
        }
    };

    if (loading) {
        return (
            <Box className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <Typography variant="body1" className="mt-4">Cargando perfil...</Typography>
                </div>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="min-h-screen flex items-center justify-center">
                <Card className="bg-red-100 border border-red-400">
                    <CardContent>
                        <Typography color="error">
                            <strong>Error: </strong>{error}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box className="max-w-4xl mx-auto p-6">
            <Typography variant="h4" component="h1" gutterBottom className="text-center mb-8">
                Mi Perfil
            </Typography>
            {user && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={3}>
                                    <Avatar 
                                        sx={{ 
                                            width: 80, 
                                            height: 80, 
                                            bgcolor: 'primary.main',
                                            fontSize: '2rem'
                                        }}
                                    >
                                        {user.email[0].toUpperCase()}
                                    </Avatar>
                                    <Box ml={3}>
                                        <Typography variant="h5" gutterBottom>
                                            {user.first_name} {user.last_name}
                                        </Typography>
                                        <Chip 
                                            label={user.is_hr ? 'Recursos Humanos' : 'Empleado'} 
                                            color={user.is_hr ? 'secondary' : 'primary'}
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <EmailIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Correo Electrónico"
                                            secondary={user.email}
                                        />
                                    </ListItem>

                                    {user.employee && (
                                        <>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <WorkIcon color="primary" />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary="Cargo"
                                                    secondary={user.employee.job_title}
                                                />
                                            </ListItem>

                                            <ListItem>
                                                <ListItemIcon>
                                                    <MoneyIcon color="primary" />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary="Salario"
                                                    secondary={`S/. ${user.employee.salary.toLocaleString()}`}
                                                />
                                            </ListItem>

                                            <ListItem>
                                                <ListItemIcon>
                                                    <BadgeIcon color="primary" />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary="ID de Empleado"
                                                    secondary={user.employee.id}
                                                />
                                            </ListItem>
                                        </>
                                    )}
                                </List>                                
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
            
            {user?.employee && (
                <VisualizadorDocs
                    employeeId={user.employee.id}
                    documentTypes={documentTypes}
                    documents={user.employee.documents}
                    onDeleteDocument={handleDeleteDocument}
                    onUploadDocument={handleUploadDocument}
                />
            )}
        </Box>
    );
}
