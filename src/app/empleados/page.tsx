'use client';

import { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Toaster, toast } from 'react-hot-toast';
import EmpleadoForm, { EmpleadoFormData } from '@/components/empleados/EmpleadoForm';
import EmpleadosTable from '@/components/empleados/EmpleadosTable';

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

export default function EmpleadosPage() {
    const { data: session } = useSession();
    const [empleados, setEmpleados] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmpleado, setSelectedEmpleado] = useState<Employee | null>(null);


    useEffect(() => {
        fetchEmpleados();
    }, [session]);

    const fetchEmpleados = async () => {
        try {
            const session = await getSession();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empleados`,
                {
                    headers: {
                        'Authorization': `Bearer ${session?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message || 'Error al obtener los empleados');
                return;
            }
            
            setEmpleados(data);
            setError('');
        } catch (err) {
            toast.error('Error al cargar los empleados');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (formData: EmpleadoFormData) => {
        try {
            const session = await getSession();
            const method = selectedEmpleado ? 'PATCH' : 'POST';
            const url = selectedEmpleado 
                ? `${process.env.NEXT_PUBLIC_API_URL}/empleados/${selectedEmpleado.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/empleados`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                toast.error(data.message || 'Error en la operación');
                return;
            }

            toast.success(data.message || 'Operación realizada con éxito');
            await fetchEmpleados();
            handleCloseModal();
        } catch (err) {
            toast.error('Error en el servidor');
            console.error('Error:', err);
        }
    };

    const handleEdit = (empleado: Employee) => {
        setSelectedEmpleado(empleado);
        setOpenModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Está seguro que desea eliminar este empleado?')) {
            return;
        }

        try {
            const session = await getSession();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empleados/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message || 'Error al eliminar el empleado');
                return;
            }

            toast.success(data.message || 'Empleado eliminado con éxito');
            await fetchEmpleados();
        } catch (err) {
            toast.error('Error al eliminar el empleado');
            console.error('Error:', err);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedEmpleado(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <Toaster 
                position="top-right"
                toastOptions={{
                    success: {
                        duration: 3000,
                        style: {
                            background: '#4caf50',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '16px',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#ef5350',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '16px',
                        },
                    },
                }}
            />
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => setOpenModal(true)}
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                            borderRadius: '8px',
                            textTransform: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        Alta de empleado
                    </Button>
                </div>
                
                {loading && (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <div className="animate-pulse flex space-x-4">
                            <div className="h-12 w-12 rounded-full bg-blue-200"></div>
                            <div className="space-y-3">
                                <div className="h-4 w-[200px] bg-blue-200 rounded"></div>
                                <div className="h-4 w-[150px] bg-blue-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {!loading && !error && empleados.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay empleados</h3>
                        <p className="mt-1 text-sm text-gray-500">Comienza agregando un nuevo empleado.</p>
                    </div>
                )}
                
                {!loading && !error && empleados.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <EmpleadosTable 
                            empleados={empleados}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                )}

                <EmpleadoForm 
                    open={openModal}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    empleado={selectedEmpleado}
                />
            </div>
        </div>
    );
}

