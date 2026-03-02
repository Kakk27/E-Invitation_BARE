import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import Splide from 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/+esm';
import { AutoScroll } from 'https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-auto-scroll@0.5.3/+esm';

const firebaseConfig = {
    apiKey: "AIzaSyDCYZgEOHWXM9wqp6GxzLpLlnwif6XaOz0",
    authDomain: "e-invitation-bare.firebaseapp.com",
    projectId: "e-invitation-bare",
    storageBucket: "e-invitation-bare.firebasestorage.app",
    messagingSenderId: "546479001788",
    appId: "1:546479001788:web:1bc2cae67019a79c6900b9",
    measurementId: "G-CQL22N32ZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const videoOverlay = document.getElementById('video-overlay');
    const introVideo = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-btn');
    const mainContent = document.getElementById('main-content');
    const rsvpForm = document.getElementById('rsvp-form');

    // Error Modal
    const errorModal = document.getElementById('error-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            errorModal.classList.add('hidden');
        });
    }
    // Close modal when clicking outside
    if (errorModal) {
        errorModal.addEventListener('click', (e) => {
            if (e.target === errorModal) {
                errorModal.classList.add('hidden');
            }
        });
    }

    // Audio Elements
    const bgAudio = document.getElementById('bg-audio');
    const muteBtn = document.getElementById('mute-btn');
    const iconMute = document.getElementById('icon-mute');
    const iconUnmute = document.getElementById('icon-unmute');

    // Mute/Unmute Logic
    let isMuted = false;
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (isMuted) {
                bgAudio.muted = false;
                isMuted = false;
                iconMute.classList.add('hidden');
                iconUnmute.classList.remove('hidden');
            } else {
                bgAudio.muted = true;
                isMuted = true;
                iconUnmute.classList.add('hidden');
                iconMute.classList.remove('hidden');
            }
        });
    }

    // Function to hide video and show main content
    const dismissVideo = () => {
        videoOverlay.classList.add('fade-out');
        mainContent.classList.remove('hidden');

        // Display mute button and play background music
        if (muteBtn) muteBtn.classList.remove('hidden');
        if (bgAudio) {
            bgAudio.volume = 0.5; // Starts at half volume
            bgAudio.play().catch(e => {
                console.log('Autoplay blocked:', e);
                // Sync UI state to muted since the browser blocked playback
                isMuted = true;
                iconUnmute.classList.add('hidden');
                iconMute.classList.remove('hidden');
            });
        }

        // Remove video to free resources after animation completes
        setTimeout(() => {
            if (introVideo.parentNode) {
                introVideo.pause();
                videoOverlay.remove();
            }
        }, 1000);
    };

    // Auto-dismiss when video ends
    introVideo.addEventListener('ended', dismissVideo);

    // Manual dismiss via skip button
    skipBtn.addEventListener('click', dismissVideo);

    // Fallback if browser blocks autoplay (e.g. strict mobile policies)
    // If the user clicks anywhere on the video overlay, just aggressively skip it so they aren't stuck on a black screen
    videoOverlay.addEventListener('click', (e) => {
        if (introVideo && !introVideo.ended) {
            dismissVideo();
        }
    });


    // Attendance Button Toggle logic
    const attendanceBtns = document.querySelectorAll('.attendance-btn');
    const attendanceInput = document.getElementById('attendance');

    attendanceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            attendanceBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (attendanceInput) attendanceInput.value = btn.getAttribute('data-value');
        });
    });

    // RSVP Form Submission
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = rsvpForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const organization = document.getElementById('organization').value;
            const email = document.getElementById('email').value;
            const attendance = document.getElementById('attendance').value;

            try {
                // Check for duplicate RSVP by email
                const rsvpsRef = collection(db, "rsvps");
                const q = query(rsvpsRef, where("email", "==", email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    document.getElementById('error-modal').classList.remove('hidden');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }

                // Save to Firestore
                await addDoc(rsvpsRef, {
                    name,
                    phone,
                    organization,
                    email,
                    attendance,
                    timestamp: serverTimestamp()
                });

                // Redirect to Thank You page
                window.location.href = 'thank-you.html';
            } catch (error) {
                console.error("Error saving RSVP to Firestore:", error);
                submitBtn.textContent = 'Error (Try Again)';
                submitBtn.disabled = false;
            }
        });
    }

    // Initialize stagger animation delays for multiple glass-panels
    const panels = document.querySelectorAll('.glass-panel');
    panels.forEach((panel, index) => {
        panel.style.animationDelay = `${0.15 * index}s`;
    });

    // Initialize Splide slider with AutoScroll
    const splideElement = document.querySelector('.splide');
    if (splideElement) {
        new Splide('.splide', {
            type: 'loop',
            drag: 'free',
            focus: 'center',
            perPage: 1,
            autoScroll: {
                speed: 0.1,
            },
            arrows: false,
            pagination: false,
        }).mount({ AutoScroll });
    }
});
