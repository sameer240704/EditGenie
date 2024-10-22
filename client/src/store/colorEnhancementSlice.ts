import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const enhanceColor = createAsyncThunk(
  'colorEnhancement/enhance',
  async ({ image, color, factor }: { 
    image: File, 
    color: [number, number, number], 
    factor: number 
  }) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('color', JSON.stringify(color));
    formData.append('enhancement_factor', factor.toString());

    const response = await fetch('/api/enhance-color', {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }
);

const colorEnhancementSlice = createSlice({
  name: 'colorEnhancement',
  initialState: {
    enhancedImage: null,
    selectedColor: null,
    enhancementFactor: 1.5,
    loading: false,
    error: null
  },
  reducers: {
    setSelectedColor: (state, action) => {
      state.selectedColor = action.payload;
    },
    setEnhancementFactor: (state, action) => {
      state.enhancementFactor = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(enhanceColor.pending, (state) => {
        state.loading = true;
      })
      .addCase(enhanceColor.fulfilled, (state, action) => {
        state.loading = false;
        state.enhancedImage = action.payload.image_url;
      })
      .addCase(enhanceColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setSelectedColor, setEnhancementFactor } = colorEnhancementSlice.actions;
export default colorEnhancementSlice.reducer;