/**
 * FileUpload — document/image picker with preview.
 * Mobile adaptation using expo-document-picker.
 *
 * Usage:
 *   <FileUpload
 *     values={files}
 *     onChange={setFiles}
 *     multiple={true}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconButton } from './IconButton';
import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FileUploadProps {
  values?: DocumentPicker.DocumentPickerAsset[];
  onChange?: (assets: DocumentPicker.DocumentPickerAsset[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  description?: string;
  maxFiles?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FileUpload({
  values = [],
  onChange,
  multiple = false,
  disabled,
  error,
  placeholder = 'Tap to upload a file',
  description = 'Supports PDF, PNG, JPG',
  maxFiles,
}: FileUploadProps) {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      dropzone: {
        borderColor: colors.border,
        backgroundColor: colors.surfacePrimary,
      },
      dropzonePressed: {
        backgroundColor: colors.surfaceSubtle,
      },
      dropzoneDisabled: {
        backgroundColor: colors.surfaceSubtle,
        borderColor: colors.borderStrong,
      },
      dropzoneError: {
        borderColor: colors.danger,
        backgroundColor: colors.dangerSubtle,
      },
      iconWrap: {
        backgroundColor: colors.surfaceSubtle,
      },
      fileItem: {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.border,
      },
    }),
    [colors]
  );

  const handlePick = async () => {
    if (disabled) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        if (multiple) {
          const combined = [...values, ...result.assets];
          onChange?.(maxFiles ? combined.slice(0, maxFiles) : combined);
        } else {
          onChange?.([result.assets[0]]);
        }
      }
    } catch (err) {
      console.warn('Error picking document', err);
    }
  };

  const removeFile = (uri: string) => {
    onChange?.(values.filter((v) => v.uri !== uri));
  };

  return (
    <View style={styles.root}>
      {/* Dropzone / Trigger */}
      {(!values.length || multiple) && (!maxFiles || values.length < maxFiles) ? (
        <Pressable
          disabled={disabled}
          onPress={handlePick}
          style={({ pressed }) => [
            styles.dropzone,
            dynamicStyles.dropzone,
            pressed && dynamicStyles.dropzonePressed,
            disabled && dynamicStyles.dropzoneDisabled,
            error ? dynamicStyles.dropzoneError : null,
          ]}>
          <View style={[styles.iconWrap, dynamicStyles.iconWrap]}>
            <Feather
              name="upload-cloud"
              size={24}
              color={disabled ? colors.textMuted : colors.textSecondary}
            />
          </View>
          <Text variant="body" tone={disabled ? 'muted' : 'primary'} style={{ fontWeight: '500' }}>
            {placeholder}
          </Text>
          {description ? (
            <Text variant="caption" tone="secondary" style={{ marginTop: spacing[1] }}>
              {description}
            </Text>
          ) : null}
        </Pressable>
      ) : null}

      {/* Selected files list */}
      {values.length > 0 ? (
        <View style={styles.fileList}>
          {values.map((file, i) => (
            <View key={file.uri + i} style={[styles.fileItem, dynamicStyles.fileItem]}>
              <Feather
                name={file.mimeType?.includes('image') ? 'image' : 'file'}
                size={20}
                color={colors.textSecondary}
              />
              <View style={styles.fileInfo}>
                <Text variant="body" numberOfLines={1}>
                  {file.name}
                </Text>
                {file.size ? (
                  <Text variant="caption" tone="secondary">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                ) : null}
              </View>
              {!disabled ? (
                <IconButton
                  icon="trash-2"
                  variant="danger"
                  size="sm"
                  accessibilityLabel="Remove file"
                  onPress={() => removeFile(file.uri)}
                />
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    gap: spacing[3],
  },
  dropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  fileList: {
    gap: spacing[2],
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: radius.md,
    borderWidth: borders.thin,
  },
  fileInfo: {
    flex: 1,
    marginStart: spacing[3],
  },
});
