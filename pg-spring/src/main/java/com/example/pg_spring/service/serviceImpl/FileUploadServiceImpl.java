package com.example.pg_spring.service.serviceImpl;

import com.example.pg_spring.service.FileUploadService;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
public class FileUploadServiceImpl implements FileUploadService {
    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucketName;

    public FileUploadServiceImpl(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public String uploadFile(MultipartFile file, String folderName) {

        try {

            String fileName =
                    folderName + "/"
                            + UUID.randomUUID()
                            + "_"
                            + file.getOriginalFilename();

            InputStream inputStream = file.getInputStream();

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            return "http://localhost:9000/"
                    + bucketName
                    + "/"
                    + fileName;

        } catch (Exception e) {
            throw new RuntimeException("File upload failed");
        }
    }
}
