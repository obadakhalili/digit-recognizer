import { defineComponent, reactive, ref } from "vue"
import { NNumberAnimation, NStatistic, NSwitch } from "naive-ui"
import Camera from "simple-vue-camera"
import * as tf from "@tensorflow/tfjs"

export default defineComponent({
  name: "App",
  setup: async () => {
    const model = await tf.loadLayersModel("./model/model.json")
    const recognizedDigits = reactive({ previous: null, current: null })
    const camera = ref(null)

    return () => (
      <main class="h-screen flex flex-col">
        <section class="p-5 flex justify-center">
          <NStatistic label="Recognized digit">
            {recognizedDigits.previous === null ||
            recognizedDigits.current === null ? (
              <span class="text-gray-500">-</span>
            ) : (
              <NNumberAnimation
                from={recognizedDigits.previous}
                to={recognizedDigits.current}
              />
            )}
          </NStatistic>
        </section>
        <section class="p-2 flex-grow">
          <Camera autoplay ref={camera} />
        </section>
        <section class="p-5 flex justify-center">
          <NSwitch
            v-slots={{
              checked: () => "Stop recognition",
              unchecked: () => "Start recognition",
            }}
            onUpdateValue={handleRecognitionSwitch()}
          />
        </section>
      </main>
    )

    function handleRecognitionSwitch() {
      let timerId

      return async (inRecognitionMode) => {
        if (inRecognitionMode) {
          timerId = setInterval(async () => {
            const snapshotBlob = await camera.value?.snapshot()
            const imageData = await createImageBitmap(snapshotBlob)
            const modelInput = tf.browser
              .fromPixels(imageData)
              .resizeNearestNeighbor([28, 28])
              .mean(2)
              .reshape([1, 784])
              .div(tf.scalar(255))
            const modelOutput = model.predict(modelInput)
            const recognition = modelOutput.argMax(1).dataSync()[0]

            recognizedDigits.previous = recognizedDigits.current
            recognizedDigits.current = recognition
          }, 500)
        } else {
          clearInterval(timerId)
        }
      }
    }
  },
})
