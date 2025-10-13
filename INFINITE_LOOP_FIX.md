# Infinite Loop Fix - Maximum Update Depth Exceeded

## Problem
The app was crashing with "Maximum update depth exceeded" error in the SpillRoomScreen component, causing an infinite render loop.

## Root Cause
The issue was in `app/spill/[id].tsx` where the `useEffect` hook had `joinSpill` and `leaveSpill` in its dependency array. These functions were created with `useCallback` that depended on state variables (`activeSpills`, `currentSpill`), which changed when joining/leaving a spill, creating an infinite loop:

1. Component renders → calls `joinSpill(id)`
2. `joinSpill` updates `activeSpills` and `currentSpill`
3. State change causes `joinSpill` callback to be recreated
4. New `joinSpill` reference triggers `useEffect` again
5. Loop repeats infinitely

## Fixes Applied

### 1. Fixed useEffect Dependencies in SpillRoomScreen
**File:** `app/spill/[id].tsx`

Changed from:
```typescript
useEffect(() => {
  if (id) {
    joinSpill(id);
  }
  return () => {
    leaveSpill();
  };
}, [id, joinSpill, leaveSpill]); // ❌ Causes infinite loop
```

To:
```typescript
useEffect(() => {
  if (id) {
    joinSpill(id);
  }
  return () => {
    leaveSpill();
  };
}, [id]); // ✅ Only runs when id changes
```

### 2. Optimized Spill Store Callbacks
**File:** `hooks/spill-store.ts`

Refactored all callbacks to use functional state updates, removing dependencies on state variables:

#### joinSpill
```typescript
const joinSpill = useCallback((spillId: string) => {
  setActiveSpills(prev => {
    const spill = prev.find(s => s.id === spillId);
    if (spill) {
      setCurrentSpill(spill);
      setIsInSpill(true);
      setIsMuted(true);
      setHasRequestedMic(false);
    }
    return prev.map(s => 
      s.id === spillId 
        ? { ...s, listenerCount: s.listenerCount + 1 }
        : s
    );
  });
}, []); // ✅ No dependencies
```

#### leaveSpill
```typescript
const leaveSpill = useCallback(() => {
  setCurrentSpill(prev => {
    if (prev) {
      setActiveSpills(prevSpills => prevSpills.map(s => 
        s.id === prev.id 
          ? { ...s, listenerCount: Math.max(0, s.listenerCount - 1) }
          : s
      ));
    }
    return null;
  });
  setIsInSpill(false);
  setIsMuted(true);
  setHasRequestedMic(false);
}, []); // ✅ No dependencies
```

#### toggleMute
```typescript
const toggleMute = useCallback(() => {
  setIsMuted(prev => {
    console.log('[Spill] Toggled mute:', !prev);
    return !prev;
  });
}, []); // ✅ No dependencies
```

#### sendReaction & sendComment
```typescript
const sendReaction = useCallback((emoji: string) => {
  const reaction: SpillReaction = {
    id: `reaction-${Date.now()}`,
    userId: 'current-user',
    emoji,
    timestamp: new Date(),
  };

  setCurrentSpill(prev => {
    if (!prev) return null;
    console.log('[Spill] Sent reaction:', emoji);
    return {
      ...prev,
      reactions: [...prev.reactions, reaction],
    };
  });
}, []); // ✅ No dependencies
```

#### endSpill
```typescript
const endSpill = useCallback(() => {
  setCurrentSpill(prev => {
    if (!prev) return null;
    
    console.log('[Spill] Ending spill:', prev.id);
    
    setActiveSpills(prevSpills => prevSpills.map(s => 
      s.id === prev.id 
        ? { ...s, isLive: false }
        : s
    ));
    
    return null;
  });
  
  setIsInSpill(false);
  setIsMuted(true);
}, []); // ✅ No dependencies
```

### 3. Added Safeguard for Listener Count
Ensured listener count never goes negative:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setActiveSpills(prev => prev.map(spill => ({
      ...spill,
      listenerCount: Math.max(0, spill.listenerCount + Math.floor(Math.random() * 10) - 5),
    })));
  }, 10000);

  return () => clearInterval(interval);
}, []);
```

## Performance Improvements

1. **Stable Callbacks**: All callbacks now have empty dependency arrays, preventing unnecessary re-creations
2. **Functional Updates**: Using functional state updates (`setState(prev => ...)`) ensures we always work with the latest state
3. **No Cascading Re-renders**: Removing state dependencies from callbacks prevents cascading re-renders
4. **Optimized Memory**: Stable callback references reduce memory allocation

## Testing
After these fixes:
- ✅ SpillRoomScreen loads without crashing
- ✅ No infinite loops or maximum update depth errors
- ✅ Joining/leaving spills works correctly
- ✅ Listener count updates properly
- ✅ All spill interactions (mute, reactions, comments) work smoothly

## Best Practices Applied

1. **Minimal Dependencies**: Keep useCallback/useMemo dependencies minimal
2. **Functional Updates**: Use functional state updates when new state depends on previous state
3. **Effect Dependencies**: Only include values that should trigger the effect
4. **Stable References**: Create stable callback references to prevent unnecessary re-renders
5. **Performance First**: Optimize for performance by reducing re-render triggers

## Related Files
- `app/spill/[id].tsx` - Spill room screen
- `hooks/spill-store.ts` - Spill state management
- `components/spill/StartSpillModal.tsx` - Start spill modal
- `components/spill/SuggestedSpills.tsx` - Suggested spills component
