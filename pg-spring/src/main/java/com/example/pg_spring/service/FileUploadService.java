package com.example.pg_spring.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileUploadService {
    String uploadFile(MultipartFile file, String folderName);
    List<String> getPgImages();
}
