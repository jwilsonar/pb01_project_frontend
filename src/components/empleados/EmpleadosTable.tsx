import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TablePagination,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Typography,
    Box,
    Tooltip,
    Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

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

interface EmpleadosTableProps {
    empleados: Employee[];
    onEdit: (empleado: Employee) => void;
    onDelete: (id: number) => void;
}

export default function EmpleadosTable({ empleados, onEdit, onDelete }: EmpleadosTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(50);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const empleadosPaginados = empleados.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (isMobile) {
        return (
            <>
                <div className="grid grid-cols-1 gap-4">
                    {empleadosPaginados.map((empleado) => (
                        <Card key={empleado.id} sx={{ 
                            borderRadius: '12px',
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }
                        }}>
                            <CardContent>
                                <Typography variant="h6" component="div" gutterBottom>
                                    {empleado.first_name} {empleado.last_name}
                                </Typography>
                                <Typography color="text.secondary" gutterBottom>
                                    {empleado.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {empleado.job_title}
                                </Typography>
                                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                    S/ {empleado.salary.toLocaleString('es-PE', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => onEdit(empleado)}
                                            sx={{ 
                                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.2)'
                                                }
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => onDelete(empleado.id)}
                                            sx={{ 
                                                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(211, 47, 47, 0.2)'
                                                }
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <TablePagination
                    component="div"
                    count={empleados.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[50]}
                    labelDisplayedRows={({ from, to, count }) => 
                        `${from}-${to} de ${count}`
                    }
                    sx={{
                        '.MuiTablePagination-toolbar': {
                            justifyContent: 'center',
                            '.MuiTablePagination-spacer': {
                                display: 'none',
                            }
                        }
                    }}
                />
            </>
        );
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                Nombre Completo
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                Correo
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                Puesto
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                Salario (S/)
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {empleadosPaginados.map((empleado) => (
                            <TableRow 
                                key={empleado.id}
                                sx={{ 
                                    '&:hover': { 
                                        backgroundColor: 'rgba(0,0,0,0.02)',
                                        transition: 'background-color 0.2s ease-in-out'
                                    }
                                }}
                            >
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {empleado.first_name} {empleado.last_name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {empleado.email}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {empleado.job_title}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="primary.main">
                                        {empleado.salary.toLocaleString('es-PE', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <Tooltip title="Editar">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => onEdit(empleado)}
                                                sx={{ 
                                                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(25, 118, 210, 0.2)'
                                                    }
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => onDelete(empleado.id)}
                                                sx={{ 
                                                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(211, 47, 47, 0.2)'
                                                    }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={empleados.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[50]}
                labelDisplayedRows={({ from, to, count }) => 
                    `${from}-${to} de ${count}`
                }
                sx={{
                    '.MuiTablePagination-toolbar': {
                        '.MuiTablePagination-spacer': {
                            flex: 'none',
                            width: '50px'
                        }
                    }
                }}
            />
        </>
    );
} 