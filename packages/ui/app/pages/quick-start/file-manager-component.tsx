import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    CircularProgress,
    Tooltip,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Download as DownloadIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    FilePresent as FileIcon
} from '@mui/icons-material';
import { api } from '../../helpers/api';
import { Text } from '../../components/text';
import Container from '@mui/material/Container';

interface FileObject {
    key: string;
    lastModified: Date;
    size: number;
    fileName: string;
}

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
};

export const FileManager: React.FC = () => {
    const [files, setFiles] = useState<FileObject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const listFiles = api.listUserFiles.useQuery();
    const getDownloadUrl = api.getDownloadUrl.useMutation();
    const deleteFile = api.deleteFile.useMutation();

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const result = await listFiles.refetch();
            if (result.data) {
                setFiles(result.data);
            }
            setError(null);
        } catch (err) {
            setError('Failed to fetch files');
            console.error('Error fetching files:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleDownload = async (fileKey: string, fileName: string) => {
        try {
            const { downloadUrl } = await getDownloadUrl.mutateAsync({ fileKey });

            // Create a temporary anchor element to trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setSuccessMessage('File download started');
        } catch (err) {
            setError('Failed to download file');
            console.error('Error downloading file:', err);
        }
    };

    const handleDelete = async (fileKey: string) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                await deleteFile.mutateAsync({ fileKey });
                await fetchFiles();
                setSuccessMessage('File deleted successfully');
            } catch (err) {
                setError('Failed to delete file');
                console.error('Error deleting file:', err);
            }
        }
    };

    const handleRefresh = () => {
        fetchFiles();
    };

    return (
        <Container
            sx={{paddingTop: '40px', paddingBottom: '40px'}}
        >
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex',  alignItems: 'center', mb: 2 }}>
                    <Text variant="h6">
                        Your Files
                    </Text>
                    <Tooltip title="Refresh files">
                        <IconButton onClick={handleRefresh} disabled={loading}>
                            <RefreshIcon/>
                        </IconButton>
                    </Tooltip>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>File Name</TableCell>
                                <TableCell align="right">Size</TableCell>
                                <TableCell align="right">Last Modified</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <CircularProgress size={24} color={"secondary"}/>
                                    </TableCell>
                                </TableRow>
                            ) : files.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <FileIcon color="disabled" />
                                            <Typography color="text.secondary">
                                                No files uploaded yet
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                files.map((file) => (
                                    <TableRow key={file.key}>
                                        <TableCell component="th" scope="row">
                                            {file.fileName}
                                        </TableCell>
                                        <TableCell align="right">{formatBytes(file.size)}</TableCell>
                                        <TableCell align="right">{formatDate(file.lastModified)}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Download file">
                                                <IconButton
                                                    onClick={() => handleDownload(file.key, file.fileName)}
                                                    disabled={getDownloadUrl.isLoading}
                                                >
                                                    <DownloadIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete file">
                                                <IconButton
                                                    onClick={() => handleDelete(file.key)}
                                                    disabled={deleteFile.isLoading}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Snackbar
                    open={!!error || !!successMessage}
                    autoHideDuration={6000}
                    onClose={() => {
                        setError(null);
                        setSuccessMessage(null);
                    }}
                >
                    <Alert
                        severity={error ? "error" : "success"}
                        onClose={() => {
                            setError(null);
                            setSuccessMessage(null);
                        }}
                    >
                        {error || successMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};