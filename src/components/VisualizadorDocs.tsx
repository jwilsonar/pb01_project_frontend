'use client'

import { useState, useCallback } from 'react';
import { 
    Box, 
    IconButton, 
    Typography, 
    Paper,
    Grid,
    CircularProgress,
    Card,
    CardContent,
    CardActions,
    Tooltip,
    Modal,
    Fade,
    Button,
    Snackbar,
    Alert
} from '@mui/material';
import { 
    Delete as DeleteIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon,
    Description as DescriptionIcon,
    Close as CloseIcon
} from '@mui/icons-material';

interface DocumentType {
    id: number;
    name: string;
}

interface Document {
    id: number;
    document_name: string;
    document_url: string;
    document_type: {
        id: number;
        name: string;
    };
}

interface Props {
    employeeId: number;
    documentTypes: DocumentType[];
    documents: Document[];
    onDeleteDocument: (documentId: number) => Promise<void>;
    onUploadDocument: (file: File, documentTypeId: number) => Promise<void>;
}

export default function VisualizadorDocs({ 
    employeeId, 
    documentTypes, 
    documents: initialDocuments = [], 
    onDeleteDocument,
    onUploadDocument 
}: Props) {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDocId, setLoadingDocId] = useState<number | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const showNotification = (message: string, severity: 'success' | 'error') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentTypeId: number) => {
        const file = event.target.files?.[0];
        if (file) {
            setLoading(true);
            try {
                await onUploadDocument(file, documentTypeId);
                // Actualizar el estado local con el nuevo documento
                const newDocument = {
                    id: Date.now(), // ID temporal hasta que se actualice la página
                    document_name: file.name,
                    document_url: URL.createObjectURL(file),
                    document_type: documentTypes.find(type => type.id === documentTypeId) || { id: documentTypeId, name: '' }
                };
                setDocuments(prev => [...prev, newDocument]);
                showNotification('Documento subido exitosamente', 'success');
            } catch (error) {
                console.error('Error al subir el documento:', error);
                showNotification('Error al subir el documento', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelete = async (documentId: number) => {
        setLoadingDocId(documentId);
        try {
            await onDeleteDocument(documentId);
            // Actualizar el estado local eliminando el documento
            setDocuments(prev => prev.filter(doc => doc.id !== documentId));
            showNotification('Documento eliminado exitosamente', 'success');
        } catch (error) {
            console.error('Error al eliminar el documento:', error);
            showNotification('Error al eliminar el documento', 'error');
        } finally {
            setLoadingDocId(null);
        }
    };
    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Documentos del Empleado
            </Typography>
            
            <Grid container spacing={3}>
                {documentTypes.map((type) => {
                    const existingDocument = documents.find(doc => doc.document_type.id === type.id);

                    return (
                        <Grid item xs={12} sm={6} md={4} key={type.id}>
                            <Card 
                                elevation={2}
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        mb: 2 
                                    }}>
                                        <DescriptionIcon color="primary" />
                                        <Typography variant="h6" component="div">
                                            {type.name}
                                        </Typography>
                                    </Box>

                                    {existingDocument ? (
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ 
                                                wordBreak: 'break-word',
                                                mb: 1
                                            }}
                                        >
                                            {existingDocument.document_name}
                                        </Typography>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No hay documento cargado
                                        </Typography>
                                    )}
                                </CardContent>

                                <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                                    {(loading && !existingDocument) || (loadingDocId === existingDocument?.id) ? (
                                        <CircularProgress size={24} />
                                    ) : existingDocument ? (
                                        <>
                                            <Tooltip title="Ver documento">
                                                <IconButton 
                                                    color="primary"
                                                    onClick={() => setSelectedDocument(existingDocument)}
                                                    size="small"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar documento">
                                                <IconButton 
                                                    color="error"
                                                    onClick={() => handleDelete(existingDocument.id)}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    ) : (
                                        <Tooltip title="Subir documento">
                                            <Box component="span">
                                                <input
                                                    accept="application/pdf"
                                                    style={{ display: 'none' }}
                                                    id={`upload-file-${type.id}`}
                                                    type="file"
                                                    onChange={(e) => handleFileUpload(e, type.id)}
                                                />
                                                <label htmlFor={`upload-file-${type.id}`}>
                                                    <IconButton 
                                                        component="span"
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </label>
                                            </Box>
                                        </Tooltip>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Modal
                open={!!selectedDocument}
                onClose={() => setSelectedDocument(null)}
                closeAfterTransition
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                }}
            >
                <Fade in={!!selectedDocument}>
                    <Box sx={{ 
                        position: 'relative',
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        boxShadow: 24,
                        p: 0,
                        width: '95vw',
                        height: '90vh',
                        maxWidth: '1200px',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ 
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1
                        }}>
                            <IconButton
                                onClick={() => setSelectedDocument(null)}
                                sx={{ 
                                    bgcolor: 'background.paper',
                                    '&:hover': { bgcolor: 'background.paper' }
                                }}
                                size="small"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ 
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden'
                        }}>
                            <object
                                data={selectedDocument?.document_url}
                                type="application/pdf"
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                            >
                                <Box sx={{ 
                                    p: 3, 
                                    textAlign: 'center' 
                                }}>
                                    <Typography variant="body1" gutterBottom>
                                        No se puede mostrar el PDF directamente.
                                    </Typography>
                                    {selectedDocument && (
                                        <Button 
                                            variant="contained" 
                                            href={selectedDocument.document_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Abrir en nueva pestaña
                                        </Button>
                                    )}
                                </Box>
                            </object>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
} 