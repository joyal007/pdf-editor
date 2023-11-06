export type file = {
    fileId: string;
    fileName: string;
    fileOrginalName?: string;
    data?: Buffer;
}

export type localFile = {
    fileId: string;
}