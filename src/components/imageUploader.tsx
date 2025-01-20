import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { UploadCloud } from "lucide-react";
import {editProfileImage} from '../services/user/userService'



// Fallback avatar
const DEFAULT_AVATAR = "https://via.placeholder.com/150?text=Avatar";

interface ImageUploaderProps {
  initialImage?: string; 
  onImageUpload: (url: string) => void; 
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ initialImage, onImageUpload }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(initialImage || null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should not exceed 2MB.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
      setIsCropping(true); 
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImage = async () => {
    return new Promise<File | null>((resolve) => {
      if (!selectedFile || !croppedAreaPixels) {
        resolve(null);
        return;
      }

      const canvas = document.createElement("canvas");
      const img = new Image();
      img.src = imageSrc!;
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        ctx?.drawImage(
          img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], selectedFile.name, { type: selectedFile.type });
            resolve(croppedFile);
          } else {
            resolve(null);
          }
        });
      };
    });
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile_image_upload"); 
    formData.append("cloud_name", "dnigy4u80");

    try {
      setUploading(true);
      const response = await editProfileImage(formData)
      setUploading(false);
      const uploadedUrl = response.data.secure_url;
      setImageSrc(uploadedUrl); 
      onImageUpload(uploadedUrl); 
    } catch (error) {
      setUploading(false);
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleCropConfirm = async () => {
    const croppedFile = await getCroppedImage();
    if (croppedFile) {
      await uploadImage(croppedFile);
    }
    setIsCropping(false); 
  };

  return (
    <div className="image-uploader">
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
  <img
    src={imageSrc || DEFAULT_AVATAR}
    alt="Profile"
    className="w-full h-full object-cover"
  />
  <label
    htmlFor="upload-input"
    className="absolute bottom-0 right-0 bg-emerald-600 text-white p-3 rounded-full cursor-pointer z-10 flex items-center justify-center"
  >
    <UploadCloud className="w-6 h-6" />
    <input
      id="upload-input"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleFileChange}
    />
  </label>
</div>



      {/* Cropping Modal */}
      <Dialog open={isCropping} onClose={() => setIsCropping(false)} fullWidth maxWidth="sm">
        <DialogTitle>Crop Image</DialogTitle>
        <DialogContent>
          <div className="relative h-64">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCropping(false)}>Cancel</Button>
          <Button onClick={handleCropConfirm} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {uploading && (
        <div className="mt-4 flex items-center">
          <CircularProgress size={24} />
          <span className="ml-2">Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
