"""
Utility helper to load saved Keras 3 models reliably across minor version variations.
"""

import inspect
import keras
from keras import ops
from keras.src.ops.operation import Operation
from keras.src.saving import serialization_lib

# Patch Operation.from_config to ignore unsupported arguments
_orig_op_from_config = Operation.from_config

@classmethod
def _safe_op_from_config(cls, config):
    sig = inspect.signature(cls.__init__)
    valid = set(sig.parameters.keys()) - {'self'}
    filtered = {k: v for k, v in config.items() if k in valid}
    return cls(**filtered)

Operation.from_config = _safe_op_from_config

# Patch deserialize_keras_object to strip incompatible fields
_orig_deserialize = serialization_lib.deserialize_keras_object

def _safe_deserialize(config, custom_objects=None, **kwargs):
    if isinstance(config, dict):
        inner = config.get('config')
        if isinstance(inner, dict):
            inner.pop('quantization_config', None)
            inner.pop('input_axes', None)
            inner.pop('output_axes', None)
    return _orig_deserialize(config, custom_objects=custom_objects, **kwargs)

serialization_lib.deserialize_keras_object = _safe_deserialize

# Patch Attention._calculate_score_mask to properly broadcast 2D masks along axis -2
def _safe_calculate_score_mask(self, scores, v_mask, use_causal_mask=False):
    scores_mask = None
    if v_mask is not None:
        if len(v_mask.shape) == 2:
            scores_mask = ops.expand_dims(v_mask, axis=-2)
        else:
            scores_mask = v_mask
    is_causal = getattr(self, "causal", False) or getattr(self, "use_causal_mask", False) or use_causal_mask
    if is_causal:
        causal_mask = self._compute_causal_mask(scores)
        scores_mask = (
            causal_mask
            if scores_mask is None
            else ops.logical_and(scores_mask, causal_mask)
        )
    return scores_mask

keras.layers.Attention._calculate_score_mask = _safe_calculate_score_mask


def load_keras_model(filepath, **kwargs):
    """Load a Keras model safely with patched deserializers and layer compatibility."""
    return keras.models.load_model(filepath, **kwargs)
