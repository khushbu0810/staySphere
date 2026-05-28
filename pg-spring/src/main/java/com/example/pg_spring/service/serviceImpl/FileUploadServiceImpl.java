package com.example.pg_spring.service.serviceImpl;

import com.example.pg_spring.service.FileUploadService;
import io.minio.*;
import io.minio.http.Method;
import io.minio.messages.Item;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class FileUploadServiceImpl implements FileUploadService {
    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucketName;

    @Value("${minio.public.url}")
    private String publicUrl;

    public FileUploadServiceImpl(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public String uploadFile(MultipartFile file, String folderName) {
        try {
            String fileName = folderName + "/"
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
            // Return browser accessible URL
            return publicUrl
                    + "/"
                    + bucketName
                    + "/"
                    + fileName;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("File upload failed");
        }
    }

    @Override
    public List<String> getPgImages() {
        List<String> pgImages = new ArrayList<>();
        try {
            Iterable<Result<Item>> objects =
                    minioClient.listObjects(
                            ListObjectsArgs.builder()
                                    .bucket(bucketName)
                                    .prefix("pg-images/")
                                    .build()
                    );
            for (Result<Item> result : objects) {
                Item item = result.get();
                String imageUrl =
                        publicUrl + "/"
                                + bucketName + "/"
                                + item.objectName();
                pgImages.add(imageUrl);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(
                    "Failed to fetch PG images"
            );
        }
        return pgImages;
    }
}
