package com.example.pg_spring.controller;

import java.util.ArrayList;
import java.util.List;

import com.example.pg_spring.model.Room;
import com.example.pg_spring.model.Tenant;
import com.example.pg_spring.repository.RoomRepo;
import com.example.pg_spring.repository.TenantRepo;
import com.example.pg_spring.service.FileUploadService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/uploads")
@CrossOrigin(origins = "http://localhost:4200")
public class FileUploadController {

    private final FileUploadService fileUploadService;
    private final TenantRepo tenantRepo;
    private final RoomRepo roomRepo;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    @Autowired
    public FileUploadController( FileUploadService fileUploadService, TenantRepo tenantRepo, RoomRepo roomRepo) {
        this.fileUploadService = fileUploadService;
        this.tenantRepo = tenantRepo;
        this.roomRepo = roomRepo;
    }


    @PostMapping("/tenant/{tenantId}/profile-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Integer tenantId, @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest()
                    .body("File too large. Maximum allowed size is 5 MB.");
        }
        Tenant tenant = tenantRepo.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        String imageUrl = fileUploadService.uploadFile(file, "tenant-profile");
        tenant.setProfileImageUrl(imageUrl);
        return ResponseEntity.ok(tenantRepo.save(tenant));
    }


    @PostMapping("/tenant/{tenantId}/identity-proof")
    public ResponseEntity<?> uploadIdentityProof(@PathVariable Integer tenantId, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a PDF file.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body("File too large. Maximum allowed size is 5 MB.");
        }
        if (!"application/pdf".equals(file.getContentType())) {
            return ResponseEntity.badRequest().body("Only PDF files are allowed.");
        }
        Tenant tenant = tenantRepo.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        String pdfUrl = fileUploadService.uploadFile(file, "identity-proof");
        tenant.setIdentityProofUrl(pdfUrl);
        return ResponseEntity.ok(tenantRepo.save(tenant));
    }


    @PostMapping("/room/{roomId}/images")
    public ResponseEntity<?> uploadRoomImages(@PathVariable Integer roomId, @RequestParam("files") List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select at least one image.");
        }
        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        List<String> existingImages = room.getRoomImageUrls();
        if (existingImages == null) {
            existingImages = new ArrayList<>();
        }
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("One of the selected files is empty.");
            }
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Image size exceeds the allowed limit. Maximum allowed size is 5 MB.");
            }
            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed.");
            }
            String imageUrl = fileUploadService.uploadFile(file, "room-images");
            existingImages.add(imageUrl);
        }
        room.setRoomImageUrls(existingImages);
        Room savedRoom = roomRepo.save(room);
        return ResponseEntity.ok(savedRoom);
    }

    @PostMapping("/pg/images")
    public ResponseEntity<?> uploadPgImages(@RequestParam("files") List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select at least one image.");
        }
        List<String> uploadedUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            // Empty file validation
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("One of the selected files is empty.");
            }
            // File size validation
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Image size exceeds the allowed limit. Maximum allowed size is 5 MB.");
            }
            // Image validation
            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed.");
            }
            // Upload image
            String imageUrl = fileUploadService.uploadFile(file, "pg-images");
            uploadedUrls.add(imageUrl);
        }
        return ResponseEntity.ok(uploadedUrls);
    }

    @GetMapping("/pg/images")
    public ResponseEntity<List<String>> getPgImages() {

        return ResponseEntity.ok(
                fileUploadService.getPgImages()
        );
    }

}




/*
for setting minio bucket public ::: 2 steps -->
1)
 docker exec -it minio mc alias set local http://localhost:9000 minioadmin minioadmin
2)
 docker exec -it minio mc anonymous set public local/pg-management
 */