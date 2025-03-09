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
    TablePagination
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

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

interface EmpleadosTableProps {
    empleados: Employee[];
    onEdit: (empleado: Employee) => void;
    onDelete: (id: number) => void;
}

export default function EmpleadosTable({ empleados, onEdit, onDelete }: EmpleadosTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(50);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const empleadosPaginados = empleados.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre Completo</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Puesto</TableCell>
                            <TableCell>Salario (S/)</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {empleadosPaginados.map((empleado) => (
                            <TableRow key={empleado.id}>
                                <TableCell>
                                    {empleado.first_name} {empleado.last_name}
                                </TableCell>
                                <TableCell>{empleado.email}</TableCell>
                                <TableCell>{empleado.job_title}</TableCell>
                                <TableCell>
                                    {empleado.salary.toLocaleString('es-PE', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        onClick={() => onEdit(empleado)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => onDelete(empleado.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
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
            />
        </>
    );
} 