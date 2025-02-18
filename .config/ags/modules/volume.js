import { Audio, Widget } from '../imports.js';
const { Box, Stack, Icon, Slider, Revealer, EventBox, Label } = Widget;

const VolumeIcon = () => Box({
  className: 'volIcon',
    children: [
      Stack({
        style: 'font-size: 16px;',
        items: [
            ['101', Widget.Label('󰕾\u{2009}')],
            ['67', Widget.Label('󰕾\u{2009}')],
            ['34', Widget.Label('󰖀\u{2009}')],
            ['1', Widget.Label('󰕿\u{2009}')],
            ['0', Widget.Label('󰝟\u{2009}')],
        ],
        connections: [[Audio, stack => {
          if (!Audio.speaker)
              return;

          if (Audio.speaker.isMuted) {
            stack.shown = '0';
            return;
          }

          const show = [101, 67, 34, 1, 0].find(
            threshold => threshold <= Audio.speaker.volume * 100);

            stack.shown = `${show}`;
        }, 'speaker-changed']],
      }),
    ],
});


const PercentBar = () => Revealer({
  transition: 'slide_right',
  revealChild: false,
  child: Slider({
    className: 'volBar',
    hexpand: true,
    drawValue: false,
    onChange: ({ value }) => Audio.speaker.volume = value,
    connections: [[Audio, slider => {
      if (!Audio.speaker)
        return;

      slider.value = Audio.speaker.volume;
    }, 'speaker-changed']],
  }),
});

const percentBar = PercentBar();

export const Volume = () => Box({
    className: 'volume',
    child: EventBox({
        onHover: () => percentBar.revealChild = true,
        onHoverLost: (widget, event) => {
        const [_, x, y] = event.get_coords()
        const w = widget.get_allocation().width;
        const h = widget.get_allocation().height;
        if (x < 0 || x > w || y < 0 || y > h) { percentBar.revealChild = false }
        },
        //connections: [[Audio, box => {box.set_tooltip_text(`${String(Math.floor(Audio.speaker.volume * 100))}%`)}, 'speaker-changed']],
        child: Box({
            children: [
                VolumeIcon(),
                percentBar
            ]
        }),
    }),
});
