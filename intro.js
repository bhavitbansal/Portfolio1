gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById("intro-video");
const fade = document.getElementById("fade-overlay");

let redirected = false;

video.muted = true;
video.playsInline = true;
video.preload = "auto";

function init() {

    const duration = video.duration;

    gsap.set(video, {
        opacity: 1
    });

    ScrollTrigger.create({

        trigger: "#scroll-container",

        start: "top top",

        end: "+=2000",

        scrub: true,

        pin: "#intro-stage",

        pinSpacing: true,

        anticipatePin: 1,

        invalidateOnRefresh: true,

        onUpdate(self) {

            const target = self.progress * duration;

            if (Math.abs(video.currentTime - target) > 0.02) {

                video.currentTime = target;

            }

            if (self.progress > 0.995 && !redirected) {

                redirected = true;

                gsap.to(fade, {

                    opacity: 1,

                    duration: 0.35,

                    ease: "power2.out",

                    onComplete() {

                        window.location.href = "home.html";

                    }

                });

            }

        }

    });

}

if (video.readyState >= 1) {

    init();

} else {

    video.addEventListener("loadedmetadata", init);

}