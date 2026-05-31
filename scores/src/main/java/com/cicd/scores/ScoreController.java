package com.cicd.scores;

import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class ScoreController {

    private final List<Score> scores = new CopyOnWriteArrayList<>();

    public ScoreController() {
        // Add some dummy data
        scores.add(new Score("PlayerOne", 5000));
        scores.add(new Score("Neo", 9999));
        scores.add(new Score("Trinity", 8500));
        scores.add(new Score("Morpheus", 7200));
        scores.add(new Score("Smith", 6000));
    }

    @PostMapping("/score")
    public Score addScore(@RequestBody Score score) {
        scores.add(score);
        return score;
    }

    @GetMapping("/scores")
    public List<Score> getScores() {
        return scores.stream()
                .sorted(Comparator.comparingInt(Score::points).reversed())
                .collect(Collectors.toList());
    }
}
