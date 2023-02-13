precision mediump float;
uniform sampler2D uSampler;
uniform vec4 uTintColor;
varying vec2 vTextureCoord;
void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uTintColor;
}