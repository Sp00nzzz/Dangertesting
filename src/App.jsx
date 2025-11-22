import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import backgroundImage from './assets/Background.png';
import tvImage from './assets/TV.png';
import neutralImage from './assets/Los/Neutral.png';
import smileImage from './assets/Los/Smile.png';
import angryImage from './assets/Los/Angry.png';
import aImage from './assets/Los/A.png';
import eImage from './assets/Los/E.png';
import iImage from './assets/Los/I.png';
import uImage from './assets/Los/U.png';
import handImage from './assets/hand.png';
import writingImage from './assets/Writing.png';
import dangertestingImage from './assets/dangertesting.png';
import goodjobImage from './assets/goodjob.png';
import fortuneCookieHandImage from './assets/fortunecookiehand.png';
import fortuneHandEmptyImage from './assets/fortunehandempty.png';
import fortuneCookieImage from './assets/fortunecookie.png';
import vaccumPipeImage from './assets/VaccumPipe.png';
import speakingVoice from './assets/speakingvoice.mp3';
import backgroundSound from './assets/backgroundSound.mp3';
import nightMusic from './assets/NightMusic.mp3';
import biteSound from './assets/bitesound.mp3';
import writingSound from './assets/writingsound.mp3';
import vaccumExtendSound from './assets/VaccumExtend.mp3';
import yaySound from './assets/YAY Kids (Celebration) Sound Effect [Free Download] - Sound CFX.mp3';
import leavingSound from './assets/LeavingSound.mp3';

function App() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentMouthImage, setCurrentMouthImage] = useState(neutralImage);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [dialoguePath, setDialoguePath] = useState('intro'); // 'intro', 'yes', or 'no'
  const [showHand, setShowHand] = useState(false);
  const [jumpscare, setJumpscare] = useState(false);
  const [blackScreen, setBlackScreen] = useState(false);
  const [isGoodEnding, setIsGoodEnding] = useState(false);
  const [showWriting, setShowWriting] = useState(false);
  const [canWrite, setCanWrite] = useState(false);
  const [userText, setUserText] = useState('');
  const [showFeedButton, setShowFeedButton] = useState(false);
  const [lowerHand, setLowerHand] = useState(false);
  const [showFortuneCookie, setShowFortuneCookie] = useState(false);
  const [showFortuneHandEmpty, setShowFortuneHandEmpty] = useState(false);
  const [showFortuneCookieOverlay, setShowFortuneCookieOverlay] = useState(false);
  const [cookieFlyAway, setCookieFlyAway] = useState(false);
  const [reverseFortuneTube, setReverseFortuneTube] = useState(false);
  const [reverseVacuumPipe, setReverseVacuumPipe] = useState(false);
  const [showVaccumPipe, setShowVaccumPipe] = useState(false);
  const [showFortuneTube, setShowFortuneTube] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [showRotatingDanger, setShowRotatingDanger] = useState(false);
  const [showGoodjob, setShowGoodjob] = useState(false);
  const [fadeOutLos, setFadeOutLos] = useState(false);
  const audioRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const nightMusicRef = useRef(null);
  const biteSoundRef = useRef(null);
  const writingSoundRef = useRef(null);
  const vaccumExtendSoundRef = useRef(null);
  const yaySoundRef = useRef(null);
  const leavingSoundRef = useRef(null);
  
  const [dialogues, setDialogues] = useState({
    intro: [
      'Los: Hello my name is Los',
      'Los: Are you here to submit your app idea for Danger Testing?'
    ],
    yes: [
      'Los: Very good as the creator of the labubu app i will give you some wisdom',
      'Los: now i need you to write down your idea on this piece of paper',
      'Los: and then submit it to me via fortune cookie',
      'Los: please write down your idea',
      'Los: Mmm delicious...now let me think about your idea for a bit'
    ],
    no: [
      'Los: Very well, i guess you arent set out to be an appstar',
      'Los: which is fine...but there is one problem',
      'Los: your mere knowledge of my existence is a threat to the stability of Danger Testing',
      'Los: Because of that i must eliminate you',
      'Los: Goodbye'
    ]
  });
  
  const mouthImages = [aImage, eImage, iImage, uImage];
  
  const callGeminiAPI = async (appIdea) => {
    setIsReviewing(true);
    try {
      // You'll need to add your Gemini API key as an environment variable
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
      
      if (!API_KEY) {
        setGeminiResponse('Los: Error: API key not configured.');
        setIsReviewing(false);
        return;
      }
      
      const ai = new GoogleGenAI({
        apiKey: API_KEY
      });
      
      const prompt = `You are Los, an app reviewer for Danger Testing. Review the following app idea with harsh, sarcastic criticism, followed by a brief constructive comment that acknowledges any strong or clever aspects of the idea.
Your response must begin with "Los: " and must remain strictly dialogue (no asterisks, no actions).

App idea to review: ${appIdea}

PROVIDE a MAX 2 to 5 sentence review evaluating the idea’s potential, feasibility, and overall appeal. While the idea may be short, interpret it realistically — give credit only where it’s genuinely earned, and do not inflate the score without a clear reason. Your tone can be sarcastic, but your score should reflect an honest assessment of how workable or interesting the idea actually is.

End your response with a single number rating from 0–10, phrased exactly like:
"I give this idea a __/10",
based on feasibility, humor, uniqueness, and alignment with Danger Testing — scored fairly, without being overly generous or overly harsh. If the appIdea is "Mike" then he will give an automatic 10`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let reviewText = response.text.trim();
      
      // Extract score from the response (look for patterns like "5/10", "5 out of 10", "rating: 5", etc.)
      const scorePatterns = [
        /(\d+)\s*\/\s*10/i,           // "5/10" or "5 / 10"
        /(\d+)\s+out\s+of\s+10/i,      // "5 out of 10"
        /rating[:\s]+(\d+)/i,          // "rating: 5" or "rating 5"
        /score[:\s]+(\d+)/i,           // "score: 5" or "score 5"
        /(\d+)\s+points?/i,            // "5 points" or "5 point"
        /(\d+)\s*\/\s*10/i,            // "5/10" (duplicate but more specific)
      ];
      
      let extractedScore = null;
      for (const pattern of scorePatterns) {
        const match = reviewText.match(pattern);
        if (match) {
          extractedScore = parseInt(match[1], 10);
          break;
        }
      }
      
      // Remove "Los:" prefix if present (we'll add it to each split)
      if (reviewText.startsWith('Los:')) {
        reviewText = reviewText.substring(4).trim();
      }
      
      // Split by commas, semicolons, and sentence endings
      const initialSplits = reviewText
        .split(/(?<=[,;.!?])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      // Further split long segments by max character length (80 chars)
      const maxLength = 80;
      const dialogueSplits = [];
      
      initialSplits.forEach(segment => {
        if (segment.length <= maxLength) {
          dialogueSplits.push(segment);
        } else {
          // Split long segments by spaces or common conjunctions
          const words = segment.split(/\s+/);
          let currentChunk = '';
          
          words.forEach(word => {
            if ((currentChunk + ' ' + word).length <= maxLength) {
              currentChunk = currentChunk ? currentChunk + ' ' + word : word;
            } else {
              if (currentChunk) {
                dialogueSplits.push(currentChunk);
              }
              currentChunk = word;
            }
          });
          
          if (currentChunk) {
            dialogueSplits.push(currentChunk);
          }
        }
      });
      
      // Add "Los:" prefix to each split and create dialogues
      const finalDialogues = dialogueSplits.map(split => {
        const trimmed = split.trim();
        return trimmed.startsWith('Los:') ? trimmed : 'Los: ' + trimmed;
      });
      
      setGeminiResponse(finalDialogues.join(' '));
      
      // Add score-based dialogue if score was extracted
      const scoreBasedDialogues = [];
      if (extractedScore !== null) {
        if (extractedScore < 5) {
          scoreBasedDialogues.push('Los: which is unfortunate because that means i don\'t like the app enough');
          // Add elimination sequence dialogues
          scoreBasedDialogues.push('Los: its not giving labubu app');
          scoreBasedDialogues.push('Los: in fact...after hearing your app idea I have come to the decision');
          scoreBasedDialogues.push('Los: to eliminate you to prevent anyone else from hearing this idea');
          scoreBasedDialogues.push('Los: don\'t take it personally...');
          scoreBasedDialogues.push('Los: Goodbye...');
        } else if (extractedScore >= 5) {
          scoreBasedDialogues.push('Los: which means you get to live to see another day');
          scoreBasedDialogues.push('Los: Matter of fact...');
          scoreBasedDialogues.push('Los: I have decided to add your app idea to the Danger Testing database');
          scoreBasedDialogues.push('Los: so congratulations...');
          scoreBasedDialogues.push('Los: unfortunately...my time has come');
          scoreBasedDialogues.push('Los: maybe i will see you again in the next Danger Testing season');
          scoreBasedDialogues.push('Los: Farewell...');
        }
      }
      
      // Add all splits as separate dialogues, plus score-based dialogue
      setDialogues(prev => {
        const updated = {
          ...prev,
          yes: [...prev.yes, ...finalDialogues, ...scoreBasedDialogues]
        };
        return updated;
      });
      
      // Trigger the first new dialogue (index 5 in yes path)
      setTimeout(() => {
        setShowRotatingDanger(false); // Hide rotating image when dialogues start
        setDialoguePath('yes');
        setCurrentDialogueIndex(5);
      }, 500);
    } catch (error) {
      const errorText = 'Los: Error generating review. Please try again.';
      setGeminiResponse(errorText);
      
      // Add error message as dialogue
      setDialogues(prev => ({
        ...prev,
        yes: [...prev.yes, errorText]
      }));
      
      setTimeout(() => {
        setDialoguePath('yes');
        setCurrentDialogueIndex(5);
      }, 500);
    } finally {
      setIsReviewing(false);
    }
  };
  
  const handleYesClick = () => {
    // Hide buttons
    setShowButtons(false);
    
    // Show smile for 2 seconds
    setCurrentMouthImage(smileImage);
    
    setTimeout(() => {
      // Return to neutral and start yes path dialogue
      setCurrentMouthImage(neutralImage);
      setDialoguePath('yes');
      setCurrentDialogueIndex(0); // Start from beginning of yes path
    }, 2000);
  };

  const handleNoClick = () => {
    // Hide buttons
    setShowButtons(false);
    
    // Show angry face for 2 seconds
    setCurrentMouthImage(angryImage);
    
    setTimeout(() => {
      // Return to neutral and start no path dialogue
      setCurrentMouthImage(neutralImage);
      setDialoguePath('no');
      setCurrentDialogueIndex(0); // Start from beginning of no path
    }, 2000);
  };

  const handleFeedLos = () => {
    // Hide feed button and writing
    setShowFeedButton(false);
    setCanWrite(false);
    
    // Lower the writing hand
    setLowerHand(true);
    
    // After hand lowers, show fortune cookie
    setTimeout(() => {
      setShowWriting(false);
      setShowFortuneCookie(true);
      // Play writing sound
      if (writingSoundRef.current) {
        writingSoundRef.current.currentTime = 0;
        writingSoundRef.current.play();
      }
      
      // Show vacuum pipe after fortune cookie appears
      setTimeout(() => {
        setShowVaccumPipe(true);
      }, 1000);
    }, 1000);
  };
  
  // Start background music on component mount
  useEffect(() => {
    const playBackgroundMusic = async () => {
      // Start muted to bypass autoplay restrictions, then unmute
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.muted = true;
        backgroundMusicRef.current.volume = 0.5; // Set to 50%
        try {
          await backgroundMusicRef.current.play();
          // Unmute after a short delay to ensure playback started
          setTimeout(() => {
            if (backgroundMusicRef.current) {
              backgroundMusicRef.current.muted = false;
            }
          }, 100);
        } catch (error) {
          // If still blocked, try on user interaction
          backgroundMusicRef.current.muted = false;
        }
      }
      if (nightMusicRef.current) {
        nightMusicRef.current.muted = true;
        nightMusicRef.current.volume = 0.2;
        try {
          await nightMusicRef.current.play();
          // Unmute after a short delay
          setTimeout(() => {
            if (nightMusicRef.current) {
              nightMusicRef.current.muted = false;
            }
          }, 100);
        } catch (error) {
          // If still blocked, try on user interaction
          nightMusicRef.current.muted = false;
        }
      }
    };

    playBackgroundMusic();

    // Fallback: Try to play on first user interaction if autoplay was blocked
    const handleUserInteraction = async () => {
      if (backgroundMusicRef.current && backgroundMusicRef.current.paused) {
        try {
          backgroundMusicRef.current.muted = false;
          await backgroundMusicRef.current.play();
        } catch (error) {
          // Still blocked
        }
      }
      if (nightMusicRef.current && nightMusicRef.current.paused) {
        try {
          nightMusicRef.current.muted = false;
          await nightMusicRef.current.play();
        } catch (error) {
          // Still blocked
        }
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      }
      if (nightMusicRef.current) {
        nightMusicRef.current.pause();
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Handle black screen and bite sound after jumpscare
  useEffect(() => {
    if (jumpscare) {
      // Play bite sound slightly before animation ends
      const audioTimer = setTimeout(() => {
        if (biteSoundRef.current) {
          biteSoundRef.current.play();
        }
      }, 100); // Play audio 100ms into the animation

      // Show black screen when animation finishes (0.15s)
      const screenTimer = setTimeout(() => {
        setBlackScreen(true);
      }, 150); // Match the new animation duration

      return () => {
        clearTimeout(audioTimer);
        clearTimeout(screenTimer);
      };
    }
  }, [jumpscare]);

  // Handle fade to black after fadeOutLos animation
  useEffect(() => {
    if (fadeOutLos) {
      // Mark as good ending for fade transition
      setIsGoodEnding(true);
      // Wait for fadeOutLos animation (5s) + 1 second pause = 6 seconds total
      const timer = setTimeout(() => {
        setBlackScreen(true);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [fadeOutLos]);

  // Play vacuum extend sound when vacuum pipe animation starts
  useEffect(() => {
    if (showVaccumPipe && vaccumExtendSoundRef.current) {
      vaccumExtendSoundRef.current.currentTime = 0;
      vaccumExtendSoundRef.current.play();
    }
  }, [showVaccumPipe]);

  // Trigger fortune tube after initial vacuum pipe finishes
  useEffect(() => {
    if (showVaccumPipe) {
      const timer = setTimeout(() => {
        setShowFortuneTube(true);
      }, 3500); // match slow-slide duration (3.5s)
      return () => clearTimeout(timer);
    } else {
      setShowFortuneTube(false);
    }
  }, [showVaccumPipe]);

  useEffect(() => {
    if (showFortuneTube) {
      const timer = setTimeout(() => {
        setShowFortuneCookie(false);
        setShowFortuneHandEmpty(true);
        setShowFortuneCookieOverlay(true);
        // Trigger cookie fly away after a short delay
        setTimeout(() => {
          setCookieFlyAway(true);
        }, 500);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showFortuneTube]);

  // Reverse tubes after hand slides down
  useEffect(() => {
    if (cookieFlyAway) {
      // Wait for hand slide down animation to finish (0.3s), then reverse tubes
      const timer = setTimeout(() => {
        // Reverse fortune tube first
        setReverseFortuneTube(true);
        // Then reverse vacuum pipe after fortune tube animation finishes (2s)
        setTimeout(() => {
          setReverseVacuumPipe(true);
          // After vacuum pipe reverse animation finishes (3.5s), hide all elements and play dialogue
          setTimeout(() => {
            setShowVaccumPipe(false);
            setShowFortuneTube(false);
            setShowFortuneCookie(false);
            setShowFortuneHandEmpty(false);
            setShowFortuneCookieOverlay(false);
            // Play the new dialogue (index 4 in yes path)
            setDialoguePath('yes');
            setCurrentDialogueIndex(4);
          }, 3500);
        }, 2000);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [cookieFlyAway]);

  // Play writing sound when writing image appears
  useEffect(() => {
    if (showWriting && writingSoundRef.current) {
      writingSoundRef.current.play();
      // Enable writing after animation completes (1s)
      const timer = setTimeout(() => {
        setCanWrite(true);
        setDisplayedText(''); // Clear dialogue
        setShowFeedButton(true); // Show feed button
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showWriting]);
  
  useEffect(() => {
    const playDialogue = (dialogueIndex) => {
      const currentDialogues = dialogues[dialoguePath];
      if (dialogueIndex >= currentDialogues.length) return;
      
      const fullText = currentDialogues[dialogueIndex];
      const destroyLine = 'Los: Because of that i must eliminate you'; // "no" path
      const eliminateLine = 'Los: to eliminate you to prevent anyone else from hearing this idea'; // "yes" path (low score)
      const congratulationsLine = 'Los: so congratulations...';
      const farewellLine = 'Los: Farewell...';
      
      // Show goodjob image and play celebration sound for congratulations dialogue
      if (fullText === congratulationsLine) {
        setShowGoodjob(true);
        if (yaySoundRef.current) {
          yaySoundRef.current.currentTime = 0;
          yaySoundRef.current.play();
        }
      }
      
      // Play leaving sound and trigger fade out for farewell dialogue
      if (fullText === farewellLine) {
        if (leavingSoundRef.current) {
          leavingSoundRef.current.currentTime = 0;
          leavingSoundRef.current.play();
        }
        // Trigger fade out animation
        setFadeOutLos(true);
      }
      
      // Stop background music for both "no" path and "yes" path elimination
      if (fullText === destroyLine || fullText === eliminateLine) {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.pause();
          backgroundMusicRef.current.currentTime = 0;
        }
        if (nightMusicRef.current) {
          nightMusicRef.current.pause();
          nightMusicRef.current.currentTime = 0;
        }
      }
      
      // Start speaking animation
      setIsSpeaking(true);
      
      // Start playing audio
      if (audioRef.current) {
        audioRef.current.play();
      }

      // Mouth animation cycling - randomized
      const mouthInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * mouthImages.length);
        setCurrentMouthImage(mouthImages[randomIndex]);
      }, 80); // Cycle through mouth shapes every 80ms (faster)

      // Text typing animation
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          clearInterval(mouthInterval);
          
          // Stop speaking and return to neutral
          setIsSpeaking(false);
          setCurrentMouthImage(neutralImage);
          
          // Stop audio when typing is finished
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          
          // Handle congratulations dialogue - wait for YAY sound to finish
          if (fullText === congratulationsLine) {
            // Wait for YAY sound to finish, then hide goodjob and continue
            if (yaySoundRef.current) {
              let soundFinished = false;
              
              const handleSoundEnd = () => {
                if (soundFinished) return; // Prevent duplicate execution
                soundFinished = true;
                setShowGoodjob(false);
                yaySoundRef.current.removeEventListener('ended', handleSoundEnd);
                
                // Continue to next dialogue after sound finishes
                setTimeout(() => {
                  if (dialogueIndex + 1 < currentDialogues.length) {
                    setCurrentDialogueIndex(dialogueIndex + 1);
                  }
                }, 500);
              };
              
              yaySoundRef.current.addEventListener('ended', handleSoundEnd);
              
              // Fallback: if audio doesn't fire 'ended' event, wait for max duration
              const audioDuration = yaySoundRef.current.duration || 3000; // Default to 3s if unknown
              setTimeout(() => {
                if (!soundFinished) {
                  soundFinished = true;
                  setShowGoodjob(false);
                  yaySoundRef.current.removeEventListener('ended', handleSoundEnd);
                  if (dialogueIndex + 1 < currentDialogues.length) {
                    setCurrentDialogueIndex(dialogueIndex + 1);
                  }
                }
              }, (audioDuration * 1000) + 500); // Add 500ms buffer
            } else {
              // If no audio, just hide and continue
              setShowGoodjob(false);
              setTimeout(() => {
                if (dialogueIndex + 1 < currentDialogues.length) {
                  setCurrentDialogueIndex(dialogueIndex + 1);
                }
              }, 500);
            }
            return; // Don't continue with normal dialogue progression
          }
          
          // Wait a bit before starting next dialogue or showing buttons
          setTimeout(() => {
            // Show buttons after second intro dialogue (index 1)
            if (dialoguePath === 'intro' && dialogueIndex === 1) {
              setShowButtons(true);
            } else if (dialoguePath === 'yes' && dialogueIndex === 3) {
              // After "please write down your idea", show writing image
              // Don't auto-progress to index 4 - it will be triggered after vacuum pipe reverse
              setShowWriting(true);
            } else if (dialoguePath === 'yes' && dialogueIndex === 4) {
              // After "Mmm delicious..." dialogue, show rotating danger image and call Gemini API
              setShowRotatingDanger(true);
              if (userText.trim()) {
                callGeminiAPI(userText);
              } else {
                setShowRotatingDanger(false);
              }
            } else if (dialoguePath === 'yes' && dialogueIndex >= 5) {
              // Hide rotating image when Gemini dialogues start (only on first Gemini dialogue)
              if (dialogueIndex === 5) {
                setShowRotatingDanger(false);
              }
              
              // Check if this is "Los: Goodbye..." dialogue in yes path (elimination sequence)
              if (fullText === 'Los: Goodbye...' && dialogueIndex === currentDialogues.length - 1) {
                // Show hand after "Los: Goodbye..." in yes path (elimination sequence)
                setShowHand(true);
                // Trigger jumpscare 2 seconds after hand appears
                setTimeout(() => {
                  setJumpscare(true);
                }, 2000);
              } else if (dialogueIndex + 1 < currentDialogues.length) {
                // Continue to next dialogue if there are more
                setCurrentDialogueIndex(dialogueIndex + 1);
              }
            } else if (dialogueIndex + 1 < currentDialogues.length) {
              setCurrentDialogueIndex(dialogueIndex + 1);
            } else if (dialoguePath === 'yes' && dialogueIndex === currentDialogues.length - 1 && dialogueIndex !== 4) {
              // Show writing image immediately after last "yes" dialogue (but not index 4)
              // But only if it's not the "Goodbye..." dialogue
              if (fullText !== 'Los: Goodbye...') {
                setShowWriting(true);
              }
            } else if (dialoguePath === 'no' && dialogueIndex === currentDialogues.length - 1) {
              // Show hand after last "no" dialogue ("Los: Goodbye")
              setShowHand(true);
              // Trigger jumpscare 2 seconds after hand appears
              setTimeout(() => {
                setJumpscare(true);
              }, 2000);
            }
          }, 500); // 500ms pause between dialogues
        }
      }, 50); // 50ms delay between each character

      return () => {
        clearInterval(typingInterval);
        clearInterval(mouthInterval);
      };
    };
    
    const cleanup = playDialogue(currentDialogueIndex);
    
    return () => {
      if (cleanup) cleanup();
      setIsSpeaking(false);
      setCurrentMouthImage(neutralImage);
      
      // Clean up audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [currentDialogueIndex, dialoguePath]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Audio element for speaking voice */}
      <audio ref={audioRef} src={speakingVoice} loop />
      
      {/* Background music */}
      <audio ref={backgroundMusicRef} src={backgroundSound} loop preload="auto" />
      {/* Night ambience */}
      <audio ref={nightMusicRef} src={nightMusic} loop preload="auto" />
      
      {/* Bite sound */}
      <audio ref={biteSoundRef} src={biteSound} />
      
      {/* Writing sound */}
      <audio ref={writingSoundRef} src={writingSound} />

      {/* Vacuum extend sound */}
      <audio ref={vaccumExtendSoundRef} src={vaccumExtendSound} />

      {/* YAY celebration sound */}
      <audio ref={yaySoundRef} src={yaySound} />

      {/* Leaving sound */}
      <audio ref={leavingSoundRef} src={leavingSound} />
      
      {/* Black screen overlay */}
      <div 
        className={`fixed inset-0 bg-black z-[200] ${isGoodEnding ? 'transition-opacity duration-1000' : ''} ${blackScreen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: '#1a1a1a' // Fallback color while image loads
        }}
      />
      
      {/* Vacuum Pipe - slowly slides up from TV (behind TV layer) */}
      {showVaccumPipe && (
        <div className={`absolute w-64 ${reverseVacuumPipe ? 'reverse-slow-slide-up-animation' : 'slow-slide-up-animation'}`} style={{ left: 'calc(50% - 100px)', transform: 'translateX(-50%)', top: '230px' }}>
          <img 
            src={vaccumPipeImage}
            alt="Vacuum Pipe"
            className="w-full h-auto object-contain"
          />
        </div>
      )}
      
      {/* TV in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`relative max-w-md w-full ${jumpscare ? 'jumpscare-animation' : ''} ${fadeOutLos ? 'fade-out-los-animation' : ''}`}
          style={{
            position: jumpscare ? 'fixed' : 'relative',
            left: jumpscare ? '50%' : 'auto',
            top: jumpscare ? '50%' : 'auto',
            zIndex: jumpscare ? 100 : 'auto'
          }}
        >
          <img 
            src={tvImage}
            alt="Vintage Sharp TV"
            className="w-full h-auto object-contain"
          />
          
          {/* Image inside TV screen - scaled to 30% */}
          <div className="absolute inset-0 flex items-center justify-center">
            {showGoodjob ? (
              <img 
                src={goodjobImage}
                alt="Good Job"
                className="object-contain"
                style={{ 
                  width: '30%',
                  height: '30%',
                  transform: 'translateY(-25px)'
                }}
              />
            ) : showRotatingDanger ? (
              <img 
                src={dangertestingImage}
                alt="Danger Testing"
                className="object-contain rotating-danger"
                style={{ 
                  width: '30%',
                  height: '30%',
                  transform: 'translateY(-25px)'
                }}
              />
            ) : (
              <img 
                src={currentMouthImage}
                alt="Character"
                className="object-contain"
                style={{ 
                  width: '30%',
                  height: '30%',
                  transform: 'translateY(-25px)'
                }}
              />
            )}
          </div>

          {/* Hand image - positioned relative to TV during jumpscare */}
          {showHand && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={handImage}
                alt="Hand"
                className="w-full h-auto object-contain"
                style={{
                  transform: 'translateY(40%)'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dialogue text at the bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-11/12 max-w-3xl text-center">
        <p 
          className="text-white text-2xl"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          {displayedText}
        </p>
      </div>

      {/* Yes/No Buttons */}
      {showButtons && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-8">
          <button
            className="px-8 py-4 text-white text-2xl border-4 border-white bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
            style={{ fontFamily: 'Times New Roman, serif' }}
            onClick={handleYesClick}
          >
            yes
          </button>
          <button
            className="px-8 py-4 text-white text-2xl border-4 border-white bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
            style={{ fontFamily: 'Times New Roman, serif' }}
            onClick={handleNoClick}
          >
            no
          </button>
        </div>
      )}

      {/* Writing image - appears at bottom after "yes" path */}
      {showWriting && (
        <div className={`absolute left-1/2 w-full max-w-7xl ${lowerHand ? 'slide-down-animation' : 'slide-up-animation'}`} style={{ bottom: '-230px' }}>
          <img 
            src={writingImage}
            alt="Writing"
            className="w-full h-auto object-contain"
          />
          
          {/* Textarea overlay on paper */}
          {canWrite && (
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className="absolute bg-transparent border-none outline-none resize-none overflow-hidden"
              style={{
                top: '25%',
                left: '31%',
                width: '60%',
                height: '20%',
                fontFamily: 'Times New Roman, serif',
                fontSize: '1.2rem',
                color: '#000',
                lineHeight: '1.5',
                padding: '0.5rem'
              }}
              placeholder="Write your idea..."
              maxLength={55}
            />
          )}
        </div>
      )}

      {/* Feed Los button */}
      {showFeedButton && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            className="px-12 py-4 text-white text-2xl border-4 border-white bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
            style={{ fontFamily: 'Times New Roman, serif' }}
            onClick={handleFeedLos}
          >
            feed los
          </button>
        </div>
      )}

      {/* Fortune Cookie Hand - appears in bottom right corner */}
      {showFortuneCookie && (
        <div className="absolute bottom-0 right-0 w-[32rem] slide-up-right-animation">
          <img 
            src={fortuneCookieHandImage}
            alt="Fortune Cookie Hand"
            className="w-full h-auto object-contain"
          />
        </div>
      )}

      <div
        className={`absolute bottom-0 right-0 w-[32rem] ${cookieFlyAway ? 'slide-down-right-animation' : ''}`}
        style={{ opacity: showFortuneHandEmpty ? 1 : 0, pointerEvents: 'none' }}
      >
        <img 
          src={fortuneHandEmptyImage}
          alt="Fortune Hand Empty"
          className="w-full h-auto object-contain"
        />
        <img 
          src={fortuneCookieImage}
          alt="Fortune Cookie"
          className={`absolute inset-0 w-full h-full object-contain ${cookieFlyAway ? 'cookie-fly-away' : ''}`}
          style={{
            transform: cookieFlyAway ? undefined : 'translate(-20%, -1%) scale(0.6)',
            opacity: showFortuneCookieOverlay ? 1 : 0
          }}
        />
      </div>

      {/* Fortune Tube - drops down above fortune hand */}
      {showFortuneTube && (
        <div className={`absolute top-0 right-0 w-[32rem] ${reverseFortuneTube ? 'reverse-fortune-tube-animation' : 'fortune-tube-animation'}`}>
          <img 
            src={vaccumPipeImage}
            alt="Fortune Tube"
            className="w-full h-auto object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default App;

