import * as React from 'react';

type Props = {
  isPlaying: boolean;
  onPlayButtonClick: () => void;
  src: string;
}

type State = {
  isLoading: boolean;
  isPlaying: boolean;
  progress: number;
}

const withAudio = (Component) => {
  class WithAudio extends React.PureComponent<Props, State> {
    private audioRef: React.RefObject<HTMLAudioElement>;

    constructor(props) {
      super(props);

      this.state = {
        progress: 0,
        isLoading: true,
        isPlaying: props.isPlaying,
      };

      this.audioRef = React.createRef();
    }

    componentDidMount() {
      const {src} = this.props;
      const audio = this.audioRef.current;

      audio.src = src;

      audio.oncanplaythrough = () => this.setState({isLoading: false});

      audio.onplay = () => this.setState({isPlaying: true});

      audio.onpause = () => this.setState({isPlaying: false});

      audio.ontimeupdate = () => this.setState({progress: Math.floor(audio.currentTime)});
    }

    componentDidUpdate() {
      const audio = this.audioRef.current;

      if (this.state.isPlaying) {
        audio.play();
        return;
      }

      audio.pause();
    }

    componentWillUnmount() {
      const audio = this.audioRef.current;

      audio.src = ``;
      audio.oncanplaythrough = null;
      audio.onplay = null;
      audio.onpause = null;
      audio.ontimeupdate = null;
    }

    render() {
      const {isLoading, isPlaying} = this.state;
      const {onPlayButtonClick} = this.props;

      return (
        <Component
          {...this.props}
          isLoading={isLoading}
          isPlaying={isPlaying}
          onPlayButtonClick={() => {
            this.setState({isPlaying: !this.state.isPlaying});
            onPlayButtonClick();
          }}
        >
          <audio ref={this.audioRef}/>
        </Component>
      );
    }
  }

  return WithAudio;
};

export default withAudio;
