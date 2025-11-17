# Components

## AddToLibrary
A reusable component that allows users to add/remove items from their library.

**Props:**
- `itemType`: 'player' | 'hero' | 'match'
- `itemId`: number (account_id, hero_id, or match_id)
- `itemName`: string (optional, for display)

**Usage:**
```jsx
<AddToLibrary
  itemType="player"
  itemId={123456789}
  itemName="Player Name"
/>
```

