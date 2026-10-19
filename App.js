import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
// RN: the core SafeAreaView is deprecated, so use this library's version instead.
// It adds padding so nothing renders under the status bar, notch or nav bar.
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#f5f6f8',
  surface: '#ffffff',
  text: '#1f2933',
  muted: '#9aa5b1',
  primary: '#3b6ef5',
  danger: '#e5484d',
  border: '#e4e7eb',
};

function TodoInput({ onAdd }) {
  const [text, setText] = useState('');

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return; // ignore empty or whitespace-only input
    onAdd(trimmed);
    setText('');
  };

  return (
    // RN: <View> stands in for <div>. Every View is a flex container, and
    // flexDirection defaults to 'column', so we set 'row' here to put the input beside the button.
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        value={text}
        // RN: onChangeText hands you the string directly, with no event.target.value.
        onChangeText={setText}
        placeholder="Add a task..."
        placeholderTextColor={COLORS.muted}
        // RN: the keyboard's return key fires onSubmitEditing (there is no <form onSubmit>).
        onSubmitEditing={submit}
        returnKeyType="done"
        // Keep the keyboard open after submitting so you can add several tasks in a row.
        submitBehavior="submit"
      />
      {/* RN: Pressable + onPress replaces <button onClick>. There are no click events on mobile. */}
      <Pressable
        onPress={submit}
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
      >
        {/* RN: strings must always be wrapped in <Text>. Raw text inside a View crashes. */}
        <Text style={styles.addButtonText}>Add</Text>
      </Pressable>
    </View>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <View style={styles.item}>
      {/* Tap target for toggling, kept separate from the delete button so they don't overlap. */}
      <Pressable
        onPress={() => onToggle(todo.id)}
        style={({ pressed }) => [styles.itemTextWrap, pressed && styles.pressed]}
      >
        <Text style={[styles.itemText, todo.done && styles.itemTextDone]}>
          {todo.title}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onDelete(todo.id)}
        // RN: hitSlop enlarges the touch area beyond the visible box, which helps small buttons on phones.
        hitSlop={8}
        style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </Pressable>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptySubtitle}>Add one above to get started.</Text>
    </View>
  );
}

function TodoScreen() {
  const [todos, setTodos] = useState([]);

  const addTodo = (title) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), title, done: false },
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const remaining = todos.filter((t) => !t.done).length;

  return (
    // Pads all edges by default: status bar on top, Android nav/gesture bar at the bottom.
    <SafeAreaView style={styles.safeArea}>
      {/* RN: KeyboardAvoidingView shrinks or shifts content so the on-screen keyboard
          doesn't cover it. Browsers handle this for you, mobile apps don't.
          'padding' works best on iOS. Expo's docs recommend leaving it undefined on Android. */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Tasks</Text>
          <Text style={styles.count}>
            {remaining} {remaining === 1 ? 'task' : 'tasks'} remaining
          </Text>
        </View>

        <TodoInput onAdd={addTodo} />

        {/* RN: FlatList replaces todos.map(...). It only renders the rows visible on
            screen (virtualization) and handles scrolling. A plain View doesn't scroll. */}
        <FlatList
          data={todos}
          // RN: keyExtractor plays the role of the `key` prop you'd add inside .map().
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} />
          )}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={styles.listContent}
          // Lets a tap on a task register even while the keyboard is open,
          // instead of the first tap only dismissing the keyboard.
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    // SafeAreaProvider must wrap the app so SafeAreaView can read the device's insets.
    <SafeAreaProvider>
      <TodoScreen />
    </SafeAreaProvider>
  );
}

// RN: no CSS files or class names. Styles are JS objects with camelCase keys,
// passed through the `style` prop. Numbers are density-independent pixels (no 'px').
// Styles don't cascade either: a Text inside a View doesn't inherit the View's font styles.
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  count: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.muted,
  },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  addButton: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexGrow: 1, // lets the empty state stretch and center in the remaining space
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    paddingRight: 12,
  },
  itemTextWrap: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  itemTextDone: {
    textDecorationLine: 'line-through',
    color: COLORS.muted,
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.muted,
  },
});
