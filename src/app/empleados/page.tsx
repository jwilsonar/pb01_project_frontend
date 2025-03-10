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
        <div className="container mx-auto p-4">
            <Toaster 
                position="top-right"
                toastOptions={{
                    success: {
                        duration: 3000,
                        style: {
                            background: '#4caf50',
                            color: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#ef5350',
                            color: '#fff',
                        },
                    },
                }}
            />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Empleados</h1>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setOpenModal(true)}
                >
                    Alta de empleado
                </Button>
            </div>
            
            {loading && <p>Cargando empleados...</p>}
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {!loading && !error && empleados.length === 0 && (
                <p>No hay empleados para mostrar.</p>
            )}
            
            {!loading && !error && empleados.length > 0 && (
                <EmpleadosTable 
                    empleados={empleados}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <EmpleadoForm 
                open={openModal}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                empleado={selectedEmpleado}
            />
        </div>
    );
}

