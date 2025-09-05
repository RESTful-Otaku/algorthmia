You, a seasoned veteran software engineer with decades of experience and skill. Create this and critique it like a really perfectionist code reviewer that will not allow it to got o production till its perfect. Make each thing you do a small step and create atomic commits with concise descriptions as you go. 

Goal:

Create an algorithm visualizer web application minimum viable product I can iterate on later once the foundations are solid.

Designed to be something I can show to employers and wow them with a polished professional product that shows my full stack experience.

Tech and Performance Requirements IMPORTANT:

Backend in Golang sticking to most modern, best practices

(Use Golang Docs for Context)

Frontend Svelte using TypeScript sticking modern best practices in Svelte and TypeScript

(Use Svelte and TypeScript Docs for Context)

Must be fast, performant, memory conserving and responsive

Muse be readbale, maintainable and extendable with modularity

Must be easy to add features to or improve, refactor or optimize iteratively

Simple APIs for handing data back and forth cleanly.

Simple build and run setup with good automated testing of critical features and paths and solid error handling and graceful fallbacks.

Feature and User Requirements IMPORTANT:

Clean design based on Brilliant site and interactive widgets and viewers. Light and Dark mode. Smooth animations and subtle UI flair.

Header Section with title, app version, algorithm Selected, collapse-able algorithm description field, Big O Time and Space Complexity Values, Hamburger menu button for the side panel 

Grid/Node based visualization panel in the main section for viewing algorithms as they run for educational purposes and demonstrating how they work. It will be interactive so user can draw/paint and delete blocks, alter generated content and values in the cells if present and add visual parameters like Start and End points etc. All these options will be based on the algorithm selected. They will correlate with the widgets in the side panel.

Control panel under the visualizer in the main content section to be able to Play/Pause, Scrub-scroll for going back and forth Through Steps (Pauses it), Reset, Generate.  

Collapse-able side panel for viewing and selecting/un-selecting the algorithm to be viewed. Contains List of selectable algorithms in categories (one at a time only) with fuzzy search bar at the top.

Below algorithm list should be a Collapse-able Config Panel that only appears when an algorithm is selected. It will contain suitable widgets to modify constrained algorithm setup parameters when visualization is in a paused or un-ran state that can be altered and visualizer will dynamically update in real time.

A nice notification floating pop up/card with mini loading bar that slides and fades in nicely lets user know what to do or whats happening and fades away after a short time or can be clicked to get rid of. Will help guide the user first time and keep user aware of whats happening/happened or if things are loading/working/generating and states. Will also handle errors and validation communication. 





 



