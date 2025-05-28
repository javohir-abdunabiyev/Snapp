'use client';

import { UploadDropzone } from "@/app/utils/uploadthing";
import Image from "next/image";
import { useState } from "react";

const ImageUpload = () => {
    const [imageUrl, setImageUrl] = useState<string>('');
    return (
        <div>
            <UploadDropzone
            appearance={{
                container: {
                    border: '1px solid'
                }
            }}
                endpoint='imageUploader'
                onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
            />
            <div>
                {imageUrl.length ? (
                    <div>
                        <Image
                            src={imageUrl}
                            alt="Uploaded Image"
                            width={500}
                            height={500}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default ImageUpload;