package com.example.pg_spring.controller;
import java.util.List;

import com.example.pg_spring.model.Room;
import com.example.pg_spring.model.Tenant;
import com.example.pg_spring.repository.RoomRepo;
import com.example.pg_spring.repository.TenantRepo;
import com.example.pg_spring.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public FileUploadController(FileUploadService fileUploadService, TenantRepo tenantRepo, RoomRepo roomRepo) {
        this.fileUploadService = fileUploadService;
        this.tenantRepo = tenantRepo;
        this.roomRepo = roomRepo;
    }

    @PostMapping("/tenant/{tenantId}/profile-image")
    public ResponseEntity<Tenant> uploadProfileImage(@PathVariable Integer tenantId, @RequestParam("file") MultipartFile file) {
        Tenant tenant = tenantRepo.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        String imageUrl = fileUploadService.uploadFile(file, "tenant-profile");
        tenant.setProfileImageUrl(imageUrl);
        return ResponseEntity.ok(tenantRepo.save(tenant));
    }

    @PostMapping("/tenant/{tenantId}/identity-proof")
    public ResponseEntity<Tenant> uploadIdentityProof(@PathVariable Integer tenantId, @RequestParam("file") MultipartFile file) {
        if (!file.getContentType().equals("application/pdf")) {
            throw new RuntimeException("Only PDF allowed");
        }
        Tenant tenant = tenantRepo.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        String pdfUrl = fileUploadService.uploadFile(file, "identity-proof");
        tenant.setIdentityProofUrl(pdfUrl);
        return ResponseEntity.ok(tenantRepo.save(tenant));
    }

    @PostMapping("/room/{roomId}/images")
    public ResponseEntity<Room> uploadRoomImages(@PathVariable Integer roomId, @RequestParam("files") List<MultipartFile> files) {
        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        List<String> existing = room.getRoomImageUrls();
        for (MultipartFile file : files) {
            String imageUrl = fileUploadService.uploadFile(file, "room-images");
            existing.add(imageUrl);
        }
        room.setRoomImageUrls(existing);
        return ResponseEntity.ok(roomRepo.save(room));
    }
}
