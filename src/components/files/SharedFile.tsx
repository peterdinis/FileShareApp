import { useQuery } from "convex/react";
import { FC } from "react";
import { api } from "../../../convex/_generated/api";

type ShareFileProps = {
    shareCode: string;
}

const ShareFile: FC<ShareFileProps> = ({
    shareCode
}: ShareFileProps) => {
    const sharedFile = useQuery(api.files.getSharedFile, { accessCode: shareCode });

    if (sharedFile === undefined) {
        return <div>Loading...</div>;
    }

    if (!sharedFile) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">File Not Found</h2>
                <p className="text-gray-600">This share link is invalid or has expired.</p>
            </div>
        );
    }

    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Shared File</h2>
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
                <h3 className="font-medium mb-2">{sharedFile.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                    {(sharedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <a
                    href={sharedFile.url ?? undefined}
                    download={sharedFile.name}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                    Download File
                </a>
            </div>
        </div>
    );
}

export default ShareFile