import { createRouter } from '../helpers/trpc';
import { getUserProfile } from './get-user-profile';
import { getUploadUrl } from './get-upload-url';
import { listUserFiles } from "./list-user-files";
import { deleteFile } from "./delete-file";
import { getDownloadUrl } from "./get-download-url";

export const rootRouter = createRouter({
    getUserProfile,
    getUploadUrl,
    listUserFiles,
    getDownloadUrl,
    deleteFile,
});

export type RootRouter = typeof rootRouter;