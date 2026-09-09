import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import { FileUpload, type FileUploadItem, Text, spacing } from '@minthr-saas/mobile-ui-kit';

export default function FileUploadScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'FileUpload' }} />
      <FileUploadBody />
    </ScrollView>
  );
}

const PHOTO_A = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400';
const PHOTO_B = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400';
const PHOTO_C = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400';

const DOCS: FileUploadItem[] = [
  { name: 'Employment contract.pdf', type: 'application/pdf', size: 248_112 },
  { name: 'Payslip january.xlsx', type: 'application/vnd.ms-excel', size: 18_440 },
  { name: 'Office badge photo.png', type: 'image/png', size: 903_221, uri: PHOTO_A },
];

const PHOTOS: FileUploadItem[] = [
  { name: 'Reception desk.jpg', type: 'image/jpeg', size: 412_004, uri: PHOTO_A },
  { name: 'Meeting room.jpg', type: 'image/jpeg', size: 388_119, uri: PHOTO_B },
  { name: 'Team lunch.jpg', type: 'image/jpeg', size: 501_662, uri: PHOTO_C },
];

const LIFECYCLE: FileUploadItem[] = [
  {
    name: 'Q3 headcount plan.xlsx',
    type: 'application/vnd.ms-excel',
    size: 1_204_000,
    status: 'uploading',
    progress: 0.42,
  },
  {
    name: 'Expense receipt.jpg',
    type: 'image/jpeg',
    size: 2_400_000,
    uri: PHOTO_B,
    status: 'error',
    errorText: 'Larger than the 2 MB limit',
  },
  { name: 'Signed offer.pdf', type: 'application/pdf', size: 88_420, status: 'done' },
  { name: 'Generated template.pdf', type: 'application/pdf', locked: true },
];

export function FileUploadBody() {
  const [singleFile, setSingleFile] = useState<FileUploadItem[]>([]);
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [compactFiles, setCompactFiles] = useState<FileUploadItem[]>(DOCS);
  const [cardFiles, setCardFiles] = useState<FileUploadItem[]>(DOCS);
  const [photos, setPhotos] = useState<FileUploadItem[]>(PHOTOS);

  return (
    <>
      <View style={styles.section}>
        <Text variant="subtitle">Dropzone — single file</Text>
        <Text variant="body" tone="secondary">
          The default. Use it when uploading is the point of the screen. The dropzone steps
          aside once a single-file selection is made.
        </Text>
        <FileUpload
          placeholder="Upload your CV"
          accept={['PDF', 'DOC', 'DOCX']}
          values={singleFile}
          onChange={setSingleFile}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Dropzone — multiple, with capacity</Text>
        <Text variant="body" tone="secondary">
          Accepted formats read as badges, and the dropzone counts down the remaining slots.
          The summary bar totals what is attached.
        </Text>
        <FileUpload
          placeholder="Upload documents"
          accept={['PDF', 'PNG', 'JPG', 'XLSX']}
          values={files}
          onChange={setFiles}
          multiple
          maxFiles={5}
          showClear
          hint="Attachments are scanned before they are shared."
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Compact — the attach field</Text>
        <Text variant="body" tone="secondary">
          A bordered field that sits among the form&apos;s other inputs. Image rows carry a real
          thumbnail; every row carries its type badge and size.
        </Text>
        <FileUpload
          variant="compact"
          placeholder="Add attachment"
          description="PDF, PNG or JPG"
          values={compactFiles}
          onChange={setCompactFiles}
          onPressItem={(item) => console.log('open', item.name)}
          multiple
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Upload lifecycle</Text>
        <Text variant="body" tone="secondary">
          `progress` draws a determinate bar in place of the meta line. `status: &apos;error&apos;`
          swaps in the failure reason and offers retry. `locked` items cannot be removed.
        </Text>
        <FileUpload
          variant="compact"
          placeholder="Add attachment"
          values={LIFECYCLE}
          onRetry={(item) => console.log('retry', item.name)}
          onPressItem={(item) => console.log('open', item.name)}
          multiple
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Grid — attaching photos</Text>
        <Text variant="body" tone="secondary">
          Square thumbnail tiles with a corner remove button, the idiomatic mobile pattern for
          photos. Uploading tiles dim behind a progress ring.
        </Text>
        <FileUpload
          variant="grid"
          placeholder="Add"
          values={photos}
          onChange={setPhotos}
          onPressItem={(item) => console.log('open', item.name)}
          multiple
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Grid — uploading</Text>
        <FileUpload
          variant="grid"
          placeholder="Add"
          gridColumns={4}
          values={[
            { name: 'Reception desk.jpg', type: 'image/jpeg', uri: PHOTO_A },
            {
              name: 'Meeting room.jpg',
              type: 'image/jpeg',
              uri: PHOTO_B,
              status: 'uploading',
              progress: 0.65,
            },
            {
              name: 'Team lunch.jpg',
              type: 'image/jpeg',
              uri: PHOTO_C,
              status: 'error',
              errorText: 'Upload failed',
            },
            { name: 'Scan.pdf', type: 'application/pdf' },
          ]}
          multiple
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Card — browsing attachments</Text>
        <Text variant="body" tone="secondary">
          Scrolling tiles with a preview band. The whole tile opens the file; the badge over the
          band carries its type.
        </Text>
        <FileUpload
          variant="card"
          placeholder="Upload"
          values={cardFiles}
          onChange={setCardFiles}
          onPressItem={(item) => console.log('open', item.name)}
          multiple
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Dense rows</Text>
        <FileUpload variant="compact" placeholder="Add attachment" values={DOCS} dense multiple />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Loading</Text>
        <FileUpload variant="compact" loading skeletonCount={2} />
        <FileUpload variant="card" loading skeletonCount={3} />
        <FileUpload variant="grid" loading skeletonCount={3} />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Read-only</Text>
        <FileUpload variant="compact" readOnly values={DOCS} onPressItem={() => {}} />
        <FileUpload variant="compact" readOnly values={[]} />
        <FileUpload variant="grid" readOnly values={[]} />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">States</Text>
        <FileUpload placeholder="Disabled upload" disabled />
        <FileUpload placeholder="Upload with error" error="File size too large" />
        <FileUpload
          variant="compact"
          placeholder="Add attachment"
          error="At least one document is required"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    gap: spacing[6],
  },
  section: {
    gap: spacing[2],
  },
});
