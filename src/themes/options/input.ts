const InputOptions = {
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: 54,
          border: '1px solid var(--ps-white)',
          '&:hover': {
            borderColor: 'var(--ps-yellow-1)'
          },
          backgroundColor: 'var(--ps-white)',
          'fieldset legend': {
            display: 'none!important'
          },
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--ps-gray-300)',
            top: 0
          },
          '&.Mui-focused': {
            fieldset: {
              borderColor: 'currentColor!important',
              borderWidth: '1px!important'
            }
          },
          '&.Mui-error': {
            color: 'var(--ps-error)',
            borderColor: 'var(--ps-error)'
          },
          '&.Mui-disabled': {
            '.Mui-disabled': {
              color: 'var(--ps-gray-300)',
              WebkitTextFillColor: 'var(--ps-gray-300)'
            }
          },
          '&.MuiInputBase-multiline': {
            height: 'auto',
            position: 'relative',
            padding: '20px 20px 36px',
            boxSizing: 'border-box',
            '& .endAdorn': {
              position: 'absolute',
              bottom: 16,
              right: 20,
              color: 'var(--ps-gray-700)'
            }
          }
        }
      }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--ps-gray-700)',
          display: 'flex',
          '&.MuiInputLabel-animated': {
            transform: 'translate(14px, 20px) scale(1)'
          },
          '&.MuiInputLabel-animated.Mui-focused': {
            transform: 'translate(14px, 12px) scale(0.75)'
          },
          '&.MuiInputLabel-animated.MuiFormLabel-filled': {
            transform: 'translate(14px, 12px) scale(0.75)'
          },
          '&.Mui-focused': {
            color: 'var(--ps-gray-700)'
          },
          '&.Mui-error': {
            color: ' var(--ps-error)'
          }
        }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          '&:not(.MuiInputAdornment-hiddenLabel)': {
            marginTop: '0 !important'
          }
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& input': {
            paddingTop: '14px !important'
          }
        },
        popper: {
          paddingTop: 8,
          paddingBottom: 8
        },
        paper: {
          borderRadius: 8,
          backgroundColor: 'var(--ps-white)',
          border: '1px solid var(--ps-gray-300)',
          boxShadow: 'none'
        },

        option: {
          height: 50
        },
        listbox: {
          '&::-webkit-scrollbar': {
            width: 6
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--ps-gray-200)',
            borderRadius: 4
          }
        }
      }
    }
  }
}

export default InputOptions.components
