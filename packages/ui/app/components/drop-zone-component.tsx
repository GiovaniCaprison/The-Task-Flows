import { Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import {useState} from "react";
import {api} from "../helpers/api";
import Container from "@mui/material/Container";
import { Text } from './text';
import { Flex } from '@aws-amplify/ui-react';
import Button from "@mui/material/Button";

export const DropZoneComponent: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);

    const getUploadUrl = api.getUploadUrl.useMutation();

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setIsUploading(true);

        try {
            const { uploadUrl } = await getUploadUrl.mutateAsync({
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size
            });

            await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            console.log('Upload complete!');
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1
    });

    return (
        <Container
        sx={{paddingTop: '40px', paddingBottom: '40px'}}
        >
            <Flex direction="column">
                <Box
                    {...getRootProps()}
                    sx={{
                        border: '2px dashed #ccc',
                        padding: 4,
                        textAlign: 'center',
                        borderRadius: '8px',
                    }}
                >
                    <input {...getInputProps()} />
                    <Text variant={'h6'} sx={{marginBottom: '5px'}}>
                        {isUploading
                            ? `Uploading...`
                            : 'Drag and drop a file here'}
                    </Text>
                    <Text>
                        or
                    </Text>
                    <Button
                        variant="contained"
                        color="secondary"
                        disabled={isUploading}
                        sx={{marginTop: '10px'}}
                    >
                        Browse
                    </Button>
                </Box>
            </Flex>
        </Container>
    );
};
