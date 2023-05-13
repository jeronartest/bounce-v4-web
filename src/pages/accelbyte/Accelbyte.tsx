import React, { useState, useEffect, useCallback } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'

export default function Accelbyte() {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: 'build/GhostieRunnerWebGL_0.2.0.loader.js',
    dataUrl: 'build/GhostieRunnerWebGL_0.2.0.data',
    frameworkUrl: 'build/GhostieRunnerWebGL_0.2.0.framework.js',
    codeUrl: 'build/GhostieRunnerWebGL_0.2.0.wasm'
  })

  const loadingPercentage = Math.round(loadingProgression * 100)

  return (
    <div className="container">
      {isLoaded === false && (
        // We'll conditionally render the loading overlay if the Unity
        // Application is not loaded.
        <div className="loading-overlay">
          <p>Loading... ({loadingPercentage}%)</p>
        </div>
      )}
      <Unity className="unity" unityProvider={unityProvider} />
    </div>
  )
}
