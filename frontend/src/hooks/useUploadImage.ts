import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/axios-client";

interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

export const useUploadImage = (folder = "products") => {
  return useMutation({
    mutationFn: async ({ file, oldKey }: { file: File; oldKey?: string }) => {
      const { data } = await apiClient.post("/s3/presigned-url", {
        folder,
        contentType: file.type,
        ...(oldKey ? { oldKey } : {}),
      });

      const { uploadUrl, fileUrl } = data.data as PresignedUrlResponse;

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image to S3");
      }

      return fileUrl;
    },
    meta: { successMessage: "image upload successfully, please save changes" },
  });
};
