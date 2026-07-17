package gov.find.controller;

import gov.find.entity.Report;
import gov.find.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/citizen")
public class CitizenController {

    // Dummy repository wiring placeholder for demo code completeness
    // In production, inject IncidentReportRepository & EvidenceService

    @PostMapping("/reports")
    public ResponseEntity<?> createReport(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("reportType") String reportType,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("districtId") Integer districtId,
            @RequestParam("incidentDate") String incidentDate,
            @RequestParam(value = "gpsLatitude", required = false) Double gpsLatitude,
            @RequestParam(value = "gpsLongitude", required = false) Double gpsLongitude,
            @RequestParam(value = "anonymous", defaultValue = "false") Boolean anonymous,
            @RequestParam(value = "evidenceFiles", required = false) MultipartFile[] evidenceFiles) {

        try {
            // 1. Map request parameters to Report entity
            Report report = new Report();
            report.setCitizenId(currentUser.getId());
            report.setReportType(Report.ReportType.valueOf(reportType));
            report.setTitle(title);
            report.setDescription(description);
            report.setDistrictId(districtId);
            report.setIncidentDate(LocalDateTime.parse(incidentDate));
            report.setGpsLatitude(gpsLatitude);
            report.setGpsLongitude(gpsLongitude);
            report.setAnonymous(anonymous);
            report.setStatus(Report.Status.SUBMITTED);

            // 2. Process uploaded evidence files safely (Simulated local storage)
            if (evidenceFiles != null && evidenceFiles.length > 0) {
                for (MultipartFile file : evidenceFiles) {
                    // In production: store securely in local storage folder or cloud buckets,
                    // perform file signature validation to prevent malformed binary exploits,
                    // and log evidence metadata.
                    String safeFileName = sanitizeFileName(file.getOriginalFilename());
                    System.out.println("Securely storing evidence: " + safeFileName + " (" + file.getSize() + " bytes)");
                }
            }

            // In production, save to repository: reportRepository.save(report);
            return ResponseEntity.status(HttpStatus.CREATED).body(report);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid incident report type metadata.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Incident reporting service encountered an error.");
        }
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getMyReports(@AuthenticationPrincipal User currentUser) {
        // Retrieve only the reports where citizenId matches the current authenticated user's ID
        // Prevents ID-harvesting / Indirect Object Reference (IDOR) vulnerabilities
        List<Report> reports = new ArrayList<>();
        // In production: reports = reportRepository.findByCitizenId(currentUser.getId());
        return ResponseEntity.ok(reports);
    }

    private String sanitizeFileName(String fileName) {
        if (fileName == null) return "evidence_unnamed";
        return fileName.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
    }
}
