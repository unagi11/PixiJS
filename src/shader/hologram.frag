precision mediump float;

uniform sampler2D uSampler;
uniform sampler2D uLineTexture;
uniform vec2 uLineResolution;
uniform vec4 uTintColor;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 vTextureCoord;

void main() {
    vec2 uv = mod(vTextureCoord * 400. + uTime * 60., 400.) / 400.;

    vec4 add_color = -texture2D(uLineTexture, uv);

    gl_FragColor = (texture2D(uSampler, vTextureCoord) + add_color) * vec4(0.3451, 0.8235, 0.8667, 1.0);
    // gl_FragColor = vec4(vTextureCoord, 0., 1.);
        // - texture2D(data, );
}
