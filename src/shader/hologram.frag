precision lowp float;

uniform sampler2D uSampler;
uniform sampler2D u_line_texture;
uniform vec2 u_line_resolution;
uniform vec4 u_tint_color;
uniform vec2 u_resolution;
uniform float uTime;

varying vec2 vTextureCoord;


float noise_speed = 0.5;
float noise_clamp_num = 0.93;
float noise_wave_num = 16.0;
float noise_power = 0.01;

void main() {
    vec2 uv = vTextureCoord;
    float v = mod(uTime, 3.0); // 3초마다

    // if (v >= 1.5) { // 3초중에 1.5초 마다
        float noise = fract(uTime * noise_speed) - (1.0 - uv.y);
        uv.x += sin(
            radians(noise * 360.0 * noise_wave_num
                // clamp(, 0.0, 360.0 * noise_clamp_num)
                )
            ) * noise_power;
    // }

    gl_FragColor = texture2D(uSampler, uv);
}
