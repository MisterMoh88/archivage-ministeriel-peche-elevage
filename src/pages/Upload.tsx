
import React from "react";
import { DocumentInfoCard } from "@/components/upload/DocumentInfoCard";
import { ArchiveLocationFields } from "@/components/upload/ArchiveLocationFields";
import { FileUploadCard } from "@/components/upload/FileUploadCard";
import { useUploadForm } from "@/hooks/useUploadForm";

export default function Upload() {
  const {
    categories,
    isPublicMarket,
    isUploading,
    selectedFiles,
    fileErrors,
    uploadResults,
    control,
    errors,
    watch,
    setValue,
    handleSubmit,
    onSubmit,
    handleFileChange,
    resetForm,
    isFormValid
  } = useUploadForm();

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title">Ajouter des documents</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DocumentInfoCard
            categories={categories}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            isPublicMarket={isPublicMarket}
          />

          <ArchiveLocationFields control={control} />

          <FileUploadCard
            selectedFiles={selectedFiles}
            fileErrors={fileErrors}
            uploadResults={uploadResults}
            isUploading={isUploading}
            isFormValid={isFormValid}
            onFileChange={handleFileChange}
            onReset={resetForm}
          />
        </form>
      </div>
    </div>
  );
}
