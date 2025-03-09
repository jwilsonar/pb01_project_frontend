export interface DocumentType {
    id: number;
    name: string;
}

export interface EmployeeDocument {
    id: number;
    document_type: DocumentType;
    document_type_id: number;
    employee_id: number;
    file_path: string;
    is_active: boolean;
}

export interface S3Config {
    region: string;
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
} 