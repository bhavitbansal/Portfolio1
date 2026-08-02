document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger Plugin safely
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.error('GSAP or ScrollTrigger failed to load.');
        // Fallback: Immediate redirect if GSAP is unavailable
        window.location.href = 'home.html';
        return;
    }

    const video = document.getElementById('intro-video');
    const fadeOverlay = document.getElementById('fade-overlay');
    let targetTime = 0;
    let isRedirecting = false;

    // Helper: Ensure metadata is loaded to calculate frame precise duration
    function onVideoReady() {
        // Fix 1: Prime the video decoder buffer so currentTime updates render immediately
        video.pause();
        video.currentTime = 0;
        video.play().then(() => {
            video.pause();
        }).catch(() => {});

        // Fix 2: Preserve full video timeline duration
        const effectiveDuration = video.duration;

        // Smooth requestAnimationFrame Interpolator to eliminate browser frame stutter
        function renderLoop() {
            if (!isRedirecting && Math.abs(video.currentTime - targetTime) > 0.001) {
                video.currentTime += (targetTime - video.currentTime) * 0.25;
            }
            requestAnimationFrame(renderLoop);
        }
        requestAnimationFrame(renderLoop);

        // GSAP ScrollTrigger Setup
        ScrollTrigger.create({
            trigger: "#scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.1, // Ultralight scrub latency for instant response
            onUpdate: (self) => {
                if (isRedirecting) return;

                // Scrub forward & backward smoothly across full video duration
                targetTime = self.progress * (effectiveDuration - 0.05);

                // Near completion triggers smooth fade to black and immediate transition
                if (self.progress >= 0.98) {
                    triggerTransition();
                } else {
                    fadeOverlay.classList.remove('is-active');
                }
            }
        });
    }

    function triggerTransition() {
        if (isRedirecting) return;
        isRedirecting = true;

        // Fade overlay to pitch black
        fadeOverlay.classList.add('is-active');

        // Redirect seamlessly to main homepage
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 450);
    }

    // Safety handling for video loading and error fallbacks
    if (video.readyState >= 1) {
        onVideoReady();
    } else {
        video.addEventListener('loadedmetadata', onVideoReady);
    }

    // Fallback: If video fails or is missing, bypass intro gracefully
    video.addEventListener('error', () => {
        window.location.href = 'home.html';
    });
});