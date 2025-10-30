# Parameter Persistence - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Eagle Plugin Environment                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Browser localStorage                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ 'eagle-movie-stitching:cropTopPercent': '85'        │  │  │
│  │  │ 'eagle-movie-stitching:cropBottomPercent': '5'      │  │  │
│  │  │ 'eagle-movie-stitching:exportFormat': 'jpg'         │  │  │
│  │  │ 'eagle-movie-stitching:exportQuality': '0.92'       │  │  │
│  │  │ 'eagle-movie-stitching:lastSaved': '2025-10-30...'  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    ┌─────────┴─────────┐
                    │  Storage Manager  │
                    │  (NEW MODULE)     │
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌─────────┐    ┌──────────┐    ┌──────────┐
        │  Save   │    │   Load   │    │ Validate │
        │ Params  │    │  Params  │    │  Params  │
        └─────────┘    └──────────┘    └──────────┘
              ▲               │
              │               │
    ┌─────────┴───────────────▼─────────┐
    │    Parameter Manager (ENHANCED)    │
    │  ┌──────────────────────────────┐  │
    │  │  constructor() {             │  │
    │  │    loadSavedParameters() ◄───┼──┼── Load on init
    │  │  }                           │  │
    │  │                              │  │
    │  │  getParams() {               │  │
    │  │    saveCurrentParameters() ◄─┼──┼── Auto-save
    │  │  }                           │  │
    │  └──────────────────────────────┘  │
    └─────────────────────────────────────┘
              ▲               │
              │               │
    ┌─────────┴───────────────▼─────────┐
    │           UI Manager               │
    │  ┌──────────────────────────────┐  │
    │  │  Event Listeners:            │  │
    │  │  - input (debounced)         │  │
    │  │  - blur (immediate)          │  │
    │  │  - change (format select)    │  │
    │  └──────────────────────────────┘  │
    └─────────────────────────────────────┘
              ▲               │
              │               ▼
    ┌─────────┴───────────────────────────┐
    │           DOM Elements               │
    │  ┌──────────────────────────────┐    │
    │  │ <input id="cropTopPercent">  │    │
    │  │ <input id="cropBottomPercent">    │
    │  │ <select id="exportFormat">   │    │
    │  │ <input id="exportQuality">   │    │
    │  └──────────────────────────────┘    │
    └───────────────────────────────────────┘
              ▲
              │
         User Interaction
```

## Data Flow Diagrams

### Flow 1: Plugin Initialization (Load Parameters)

```
┌─────────────┐
│ Plugin Open │
└──────┬──────┘
       │
       ▼
┌────────────────────────┐
│ Eagle Plugin Lifecycle │
│ eagle.onPluginCreate() │
└──────┬─────────────────┘
       │
       ▼
┌───────────────────────────────┐
│ MoviePictureStitchingApp.init()│
└──────┬────────────────────────┘
       │
       ▼
┌───────────────────────────────┐
│ ParameterManager.constructor()│
└──────┬────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ loadSavedParameters()        │ ◄─── NEW
│  1. Check storage available  │
│  2. Load each parameter      │
│  3. Validate loaded values   │
│  4. Apply to defaults        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ StorageManager.loadParameter()│
│  - Read from localStorage     │
│  - Parse JSON                │
│  - Validate type/range       │
│  - Return value or default   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ applyParametersToDOM()       │ ◄─── NEW
│  - Wait for DOM ready        │
│  - Set input values          │
│  - Update remaining displays │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ UI Displays Saved Parameters │
└──────────────────────────────┘
```

### Flow 2: User Adjusts Parameter (Save Parameters)

```
┌─────────────────┐
│ User Changes    │
│ Input Value     │
└──────┬──────────┘
       │
       ▼
┌──────────────────────────────┐
│ DOM Event: 'input'           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ UIManager Event Listener     │
│ (with 500ms debounce)        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Dispatch Custom Event:       │
│ 'ui:parameterChanged'        │
│ { element: 'cropTopPercent' }│
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ ParameterManager Listener    │
│ handleParameterChange()      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ getParams(adjustingElement)  │
│  1. Read DOM values          │
│  2. Validate ranges          │
│  3. Smart adjustment         │
│  4. Return params object     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ saveCurrentParameters(params)│ ◄─── NEW
│  1. Check if changed         │
│  2. Debounce 300ms           │
│  3. Trigger save             │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ StorageManager.saveParameter()│
│  1. Validate value           │
│  2. JSON stringify           │
│  3. localStorage.setItem()   │
│  4. Handle errors            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Parameters Saved ✓           │
│ (Silent, no user feedback)   │
└──────────────────────────────┘
```

### Flow 3: Error Handling (Storage Unavailable)

```
┌──────────────────────────────┐
│ Try to Save Parameter        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ StorageManager               │
│ isStorageAvailable()         │
└──────┬───────────────────────┘
       │
       ├─── YES ───────────────────┐
       │                           ▼
       │                  ┌─────────────────┐
       │                  │ Save to Storage │
       │                  │ Return true     │
       │                  └─────────────────┘
       │
       └─── NO ────────────────────┐
                                   ▼
                          ┌─────────────────────┐
                          │ console.warn()      │
                          │ "Storage unavailable"│
                          │ Return false        │
                          └──────┬──────────────┘
                                 │
                                 ▼
                          ┌─────────────────────┐
                          │ Plugin Continues    │
                          │ (Parameters not     │
                          │  persisted)         │
                          └─────────────────────┘
```

## Module Interaction Map

```
┌───────────────────────────────────────────────────────────────┐
│                  plugin-modular.js (Main App)                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Orchestrates all modules                               │  │
│  │  - Initializes modules in correct order                 │  │
│  │  - Sets up event listeners                              │  │
│  │  - Coordinates workflows                                │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌──────────────────┐   ┌───────────────┐
│  UI Manager   │   │ Parameter Manager │   │ Eagle API     │
│               │   │    (ENHANCED)     │   │  Manager      │
│ - Renders UI  │   │ - Validates       │   │               │
│ - Events      │   │ - LOADS params ◄──┼───│ - Selection   │
│ - Feedback    │   │ - SAVES params    │   │ - Polling     │
└───────────────┘   └──────────┬───────┘   └───────────────┘
        │                      │                     
        │            ┌─────────▼─────────┐           
        │            │ Storage Manager   │           
        │            │    (NEW)          │           
        │            │ ┌───────────────┐ │           
        │            │ │ - Save        │ │           
        │            │ │ - Load        │ │           
        │            │ │ - Validate    │ │           
        │            │ │ - Storage API │ │           
        │            │ └───────────────┘ │           
        │            └─────────┬─────────┘           
        │                      │                     
        └──────────────────────┼──────────────────┐  
                               │                  │  
                ┌──────────────▼───────┐   ┌─────▼──────┐
                │  Canvas Renderer     │   │   File     │
                │                      │   │  Manager   │
                │  - No changes needed │   │            │
                └──────────────────────┘   └────────────┘
```

## Storage Manager Internal Architecture

```
┌─────────────────────────────────────────────────────────┐
│              StorageManager Class                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Properties:                                             │
│  ┌────────────────────────────────────────────────┐     │
│  │ storagePrefix = 'eagle-movie-stitching:'       │     │
│  │ validationRules = { /* parameter constraints */}│     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  Public Methods:                                         │
│  ┌────────────────────────────────────────────────┐     │
│  │ saveParameter(key, value) → boolean            │     │
│  │ loadParameter(key, defaultValue) → any         │     │
│  │ saveAllParameters(params) → boolean            │     │
│  │ loadAllParameters() → object                   │     │
│  │ clearAllParameters() → void                    │     │
│  │ isStorageAvailable() → boolean                 │     │
│  │ validateParameter(key, value) → boolean        │     │
│  │ getStorageInfo() → object                      │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  Private Methods:                                        │
│  ┌────────────────────────────────────────────────┐     │
│  │ _parseValue(value, key) → any                  │     │
│  │ _serializeValue(value) → string                │     │
│  │ _getStorageKey(key) → string                   │     │
│  │ _handleStorageError(error) → void              │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Validation Flow

```
Parameter Value
      │
      ▼
┌─────────────────┐
│ Type Check      │ ──── Number, String, valid type?
└────┬────────────┘
     │ Valid
     ▼
┌─────────────────┐
│ Range Check     │ ──── Within min/max bounds?
└────┬────────────┘      cropTop: 0-99
     │ Valid            cropBottom: 0-99
     ▼                  quality: 0.1-1.0
┌─────────────────┐
│ Format Check    │ ──── exportFormat in ['jpg','png','webp']?
└────┬────────────┘
     │ Valid
     ▼
┌─────────────────┐
│ Constraint Check│ ──── cropTop + cropBottom < 100?
└────┬────────────┘
     │ Valid
     ▼
┌─────────────────┐
│ Accept Value    │ ──── Save to storage / Apply to DOM
└─────────────────┘

     │ Invalid at any step
     ▼
┌─────────────────┐
│ Reject Value    │ ──── Use default / Log warning
└─────────────────┘
```

## Timing Diagram (Debouncing)

```
Time: 0ms    100ms   200ms   300ms   400ms   500ms   600ms   700ms   800ms   900ms
      │       │       │       │       │       │       │       │       │       │
User: ▼───────▼───────▼─────────────────────────────▼───────────────────────────▼
      85      86      87                            90                          95
      │       │       │                             │                           │
      │       │       │                             │                           │
Input ├───────┼───────┼─────────────────────────────┼───────────────────────────┤
Event │ start │cancel │cancel                 start │ cancel              start │
      │ timer │ timer │ timer                 timer │ timer               timer │
      │       │       │                             │                           │
      │       │       │                             │                           │
Save: │       │       │                             │                           │
      │       │       └─────► SAVE(87)              │                           │
      │       │           (300ms after last input)  │                           │
      │       │                                     └─────► SAVE(90)            │
      │       │                                         (300ms after input)     │
      │       │                                                                 └─────► SAVE(95)
      │       │                                                                     (300ms later)

Result: Only 3 saves instead of 9 (66% reduction)
```

## Error Recovery Flowchart

```
┌─────────────────────────┐
│  Load Parameters        │
└──────────┬──────────────┘
           │
           ▼
      ┌────────────┐
      │ Try Load   │
      └──┬─────────┘
         │
    ┌────┴────┐
    │ Success?│
    └────┬────┘
         │
    ┌────┴─────────────────────────┐
    │                              │
  YES                             NO
    │                              │
    ▼                              ▼
┌─────────────┐          ┌──────────────────┐
│ Validate    │          │ Parse Error?     │
│ Values      │          │ Quota Error?     │
└──┬──────────┘          │ Disabled?        │
   │                     └────┬─────────────┘
   │                          │
┌──┴──────┐                   │
│ Valid?  │                   │
└──┬──────┘                   │
   │                          │
┌──┴────────────────┐         │
│                   │         │
YES                NO         │
│                  │          │
▼                  ▼          ▼
┌─────────┐   ┌──────────────────────┐
│ Apply   │   │ Log Warning          │
│ Values  │   │ Use Defaults         │
│ to DOM  │   │ Continue Execution   │
└─────────┘   └──────────────────────┘
```

---

## Key Design Principles

1. **Fail Gracefully:** Never crash on storage errors
2. **Validate Everything:** Don't trust stored data
3. **Debounce Saves:** Reduce unnecessary write operations
4. **Transparent to Users:** No manual save/load actions
5. **Module Isolation:** Storage Manager is self-contained
6. **Event-Driven:** Follow existing architecture patterns

---

**Legend:**
- `▼` : Data flow direction
- `◄─` : Return value / callback
- `├──` : Conditional branch
- `✓` : Success state
- `✗` : Error state
